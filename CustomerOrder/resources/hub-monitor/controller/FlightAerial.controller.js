sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"libs/leaflet",
	"libs/d3",
	"libs/D3SvgOverlay",
	"libs/moment"
], function(Controller, JSONModel, leaflet, d3, D3SvgOverlay) {
	"use strict";

	return Controller.extend("hub-monitor.controller.FlightAerial", {
		onInit: function() {
			this.standsModel = new JSONModel("./appResources/local-service/stands.json");
			this.aircraftsModel = new JSONModel("/destinations/NeoHANA/Read_hub_data/read_hublist_aerial.xsjs?arrdep=A");

			this.aircraftsModel.attachRequestCompleted(function(){
				this._updateModel(this.aircraftsModel);
			}, this);
			
			this.sidePanelModel = new JSONModel();

			this.getView().setModel(this.sidePanelModel);

			var oModel = new JSONModel("./appResources/local-service/quick-connections.json");
			this.getView().setModel(oModel, "connections");

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		toPTS: function(evt) {
			const flightData = this.sidePanelModel.getData();
			const dateTimeFormat = 'YYYYMMDDHHmmss';
			const param = {
				arrivalFlight: flightData.fltnum_1,
				arrivalDatetime: flightData.arr_dt.toString(), 
				departureFlight: flightData.fltnum_2,
				departureDatetime: flightData.dep_dt.toString(),
				filter: flightData.origin === 'DXB' ? 'D' : 'A'
			};
			
			window.open(`https://sap-solution-experience-sdcplatform-prod-pts.cfapps.eu10.hana.ondemand.com/index.html?flightOne=BR${param.arrivalFlight}&flightOneEndTime=${param.arrivalDatetime}&flightTwo=BR${param.departureFlight}&flightTwoStartTime=${param.departureDatetime}&PTS=${param.filter}`, '_blank');
			//window.open(`https://pts-a577bbf7e.dispatcher.hana.ondemand.com/?flightOne=BR${param.arrivalFlight}&flightOneEndTime=${param.arrivalDatetime}&flightTwo=BR${param.departureFlight}&flightTwoStartTime=${param.departureDatetime}&PTS=${param.filter}`, '_blank');
		},
		
		_updateModel: function(model){
			const processedData = {
				"flights": []
			};
			
			if(!model.getData()) {
				return;
			}
			
			if (Array.isArray (model.getData())) {
				processedData.flights = model.getData().map(d => d.flights);
			} else {
				processedData.flights = model.getData().flights;
			}
			
			// Get stats
			processedData.criticalCount = processedData.flights.filter(d => d.critical).length;
			processedData.nonCriticalCount = processedData.flights.length - processedData.criticalCount;
			
			// Set data to model
			model.setData(processedData);
			
			model.refresh(true);
		},
		
		showDetails: function(oEvent) {
			/*MVP 3*/
			var sKey = oEvent.getSource().getKey();
			const flightData = this.sidePanelModel.getData();
			
			var sDateTime = flightData.dep_dt; 
			var sDate;
			var sTime; 
			
			if (sDateTime.charAt(4) === "-") {
				sDate = flightData.dep_dt.substring(0, 10);
				sTime = flightData.dep_dt.substring(11, 19);
			} else {
				sDate = flightData.dep_dt.substring(0, 4) + "-" + flightData.dep_dt.substring(4, 6) + "-" + flightData.dep_dt.substring(6, 8);
				sTime = flightData.dep_dt.substring(8, 10) + ":" + flightData.dep_dt.substring(10, 12) + ":" + flightData.dep_dt.substring(12, 14);
			}
			
			const param = {
				departureFlight: flightData.fltnum_2,
				departureFlightDate: sDate,
				departureFlightTime: sTime, 
				tail: flightData.general[3].value
			};
			
			if (sKey.startsWith("PX")) {
				//window.open(`https://paxtmonitoring-a577bbf7e.dispatcher.hana.ondemand.com/?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
				window.open(`https://sap-solution-experience-sdcplatform-prod-paxtracker.cfapps.eu10.hana.ondemand.com/index.html?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
			} else {
				//window.open(`https://baggagetracker-a577bbf7e.dispatcher.hana.ondemand.com/?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
				window.open(`https://sap-solution-experience-sdcplatform-prod-baggagetracker.cfapps.eu10.hana.ondemand.com/index.html?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
			}
			
			/*MVP 2*/
			/*if (!this._oPAXDialog) {
				this._oPAXDialog = sap.ui.xmlfragment("hub-monitor.view.PAXConnections", this);
				this.getView().addDependent(this._oPAXDialog);
			}
			this._oPAXDialog.open();*/
			//document.addEventListener("click", this._onClosePAX.bind(this));
		},

		toInbound: function(oEvent) {
			var oDialog = sap.ui.getCore().byId("paxDialog");
			oDialog.setContentWidth("500px");

			var oNavCon = sap.ui.getCore().byId("navCon");
			var oInbound = sap.ui.getCore().byId("inbound");
			oNavCon.to(oInbound);
		},

		onBack: function(oEvent) {
			var oDialog = sap.ui.getCore().byId("paxDialog");
			oDialog.setContentWidth("400px");

			var oNavCon = sap.ui.getCore().byId("navCon");
			oNavCon.back();
		},
		onCloseDialog: function(evt) {
			this._oPAXDialog.close();
		},
		onAfterRendering: function() {
			// TODO: A quick fix to the gap and inability to assign a class to "content's section"
			$(".sapMPageEnableScrolling").addClass("no-padding");

			const mapId = `hub-map`;
			// Initilize map
			const map = L.map(mapId, {
				crs: L.CRS.Simple,
				maxZoom: 1,
				minZoom: -2,
				attributionControl: false
			});

			// Define bounds
			const bounds = [
				[0, 0],
				[-4336, 8000]
			];

			// Add base image
			const image = L.imageOverlay("./appResources/asset/media/images/map.jpg", bounds).addTo(map);

			map.setView([-3000, 3000], -2).setMaxBounds(bounds);

			// Add stand overlay layer
			const standsOverlay = L.d3SvgOverlay(this._renderStands.bind(this));

			// Add overlay to map once data was loaded (async)
			this.standsModel.attachRequestCompleted(function() {
				standsOverlay.addTo(map);
			});

			// Add aircraft overlay layer
			const aircraftsOverlay = L.d3SvgOverlay(this._renderAircrafts.bind(this));

			// Add overlay to map once data was loaded (async)
			this.aircraftsModel.attachRequestCompleted(function() {
				aircraftsOverlay.addTo(map);
			});

			// Get reference to side panel
			this.sidePanelControl = $(`#${this.getView().byId("side-panel").getId()}`).css({
				opacity: 0
			});
		},
		_getTheta: function(orientation) {
			switch (orientation) {
				case "U":
					return 180;
				case "R":
					return -90;
				case "D":
					return 0;
				case "L":
					return 90;
			}
		},
		_renderStands: function(selection, projection) {
			selection
				.selectAll(".stand")
				.data(this.standsModel.getData())
				.enter()
				.append("image")
				.attr("data-stand-number", d => d.Stand)
				.attr("href", "./appResources/asset/media/images/stand.svg")
				.classed("stand", true)
				.attr("transform", (d) => {
					const coordinates = [+d.ycoord, +d.xcoord];
					const projected = {
						x: projection.latLngToLayerPoint(coordinates).x,
						y: projection.latLngToLayerPoint(coordinates).y,
						r: this._getTheta(d.orient)
					}
					return `translate(${projected.x}, ${projected.y}) rotate(${projected.r})`;
				});
		},
		_renderAircrafts: function(selection, projection) {
			const flightsData = this.aircraftsModel.getData().flights.filter(d => d.origin == "DXB");
			const flightsStandData = flightsData.map(d => d.general[1].value);
			const aircraftsData = this.standsModel.getData().filter(d => flightsStandData.includes(d.Stand));
			const that = this;

			// Data selection
			const markers = selection
				.selectAll(".aircraft")
				.data(aircraftsData, d => d.Stand); // key specified!

			// Enter block
			const enter = markers.enter()
				.append("g")
				.attr("data-stand", d => d.Stand)
				.classed("aircraft", true)
				.attr("transform", (d) => {
					const coordinates = [+d.ycoord, +d.xcoord];
					const projected = {
						x: projection.latLngToLayerPoint(coordinates).x,
						y: projection.latLngToLayerPoint(coordinates).y,
						r: this._getTheta(d.orient)
					}

					switch (d.orient) {
						case "U":
							projected.y -= 7.5;
							break;
						case "R":
							projected.x += 15;
							projected.y -= 5.5;
							break;
						case "D":
							projected.y += 7.5;
							break;
						case "L":
							projected.x -= 7;
							break;
					}

					return `translate(${projected.x}, ${projected.y}) rotate(${projected.r}) scale(0.075)`;
				});

			// Draw status indicators
			enter
				.append("circle")
				.attr("r", "20px")
				.attr("cx", d => {
					const projected = {
						x: 85
					};

					return `${projected.x}px`;
				})
				.attr("cy", d => {
					const projected = {
						y: 170
					};

					return `${projected.y}px`;
				})
				.style("fill", d => {
					const stand = d.Stand;
					const flightStatus = flightsData.filter(d => stand == d.general[1].value)[0].status;

					switch (flightStatus) {
						case "complete":
							return "#1ca012";
						case "in-progress":
							return "#ffc700";
						case "delayed":
							return "#ab0000";
					}
				});

			// Draw aircrafts
			enter
				.append("image")
				.attr("href", "./appResources/asset/media/images/aircraft.svg")
				// .style("opacity", 0)
				.on("click", d => {
					const stand = d.Stand;
					const selected = flightsData.filter(d => d.general[1].value == stand)[0];

					that.sidePanelModel.setData(selected);

					that.sidePanelControl
						.animate({
							opacity: 1
						}, {
							duration: 350,
							queue: false
						});
				});
			// .attr("transform", (d) => {
			// 	const coordinates = [+d.ycoord, +d.xcoord];
			// 	const projected = {
			// 		x: projection.latLngToLayerPoint(coordinates).x,
			// 		y: projection.latLngToLayerPoint(coordinates).y,
			// 		r: this._getTheta(d.orient)
			// 	}

			// 	switch (d.orient) {
			// 		case "U":
			// 			projected.y -= 10;
			// 			break;
			// 		case "R":
			// 			projected.x += 10;
			// 			break;
			// 		case "D":
			// 			projected.y += 10;
			// 			break;
			// 		case "L":
			// 			projected.x -= 10;
			// 			break;
			// 	}

			// 	return `translate(${projected.x}, ${projected.y}) rotate(${projected.r}) scale(0.075)`;
			// 	});

			// Exit block
			markers
				.exit()
				.transition()
				.duration(750)
				.attr("transform", (d) => {
					const coordinates = [+d.ycoord, +d.xcoord];
					const projected = {
						x: projection.latLngToLayerPoint(coordinates).x,
						y: projection.latLngToLayerPoint(coordinates).y,
						r: this._getTheta(d.orient)
					}

					switch (d.orient) {
						case "U":
							projected.y -= 20;
							break;
						case "R":
							projected.x += 20;
							break;
						case "D":
							projected.y += 20;
							break;
						case "L":
							projected.x -= 20;
							break;
					}

					return `translate(${projected.x}, ${projected.y}) rotate(${projected.r}) scale(0.075)`;
				})
				.style("opacity", 0)
				.remove();

			// setInterval(() => {
			// 	that.aircraftsModel.loadData("/destinations/NeoHANA/demo_mvp2/hub.xsjs", null, false);
			// 	that._renderAircrafts(selection, projection);
			// }, 1000);
		},
		toOrders: function() {
			this.router.navTo("order-list");
		}
	});
});