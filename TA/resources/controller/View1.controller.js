sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/Button',
	'sap/m/ObjectAttribute',
	'sap/m/Label',
	'sap/ui/core/HTML',
	'TurnAroundView/model/formatter',
	"sap/ui/core/ws/WebSocket"
], function(Controller, JSONModel, MessageToast, Filter, Sorter, Dialog, Text, Button, ObjectAttribute, Label, HTML, formatter, WebSocket) {
	"use strict";
	var webSocket;
	return Controller.extend("TurnAroundView.controller.View1", {
		formatter: formatter,

		onInit: function() {

							// For Demo Utilization Tracking purpose
	
							var DEMO_ID = "15800"; //12180
							var DEMO_AREA = "Bestrun";
							var DEMO_COMMENT = "Bestrun Airways - Ground Ops Monitoring";
						 
							// Check if the DEMO_ID is not empty and if the app are not running in the test mode of the WebIDE
							 if (DEMO_ID && location.hostname.indexOf("webidetesting") === -1) {
								if (typeof trackDemo !== "function") {
								   jQuery.sap.includeScript( /* eslint-disable sap-no-hardcoded-url */
									  "https://apim-sdccsademo.apimanagement.hana.ondemand.com/sdc_demotracking/DemoTracking.js",
									  /* eslint-enable sap-no-hardcoded-url */
									  "DemoTracking",
									  function() {
										 /* eslint-disable no-undef */
										 trackDemo(DEMO_ID, DEMO_AREA, DEMO_COMMENT);
										 /* eslint-enable no-undef */
									  },
									  function(err) { // For error debugging
										 JSON.stringify(err);
									  }
								   );
								} else {
								   /* eslint-disable no-undef */
								   trackDemo(DEMO_ID, DEMO_AREA, DEMO_COMMENT);
								   /* eslint-enable no-undef */
								}
							 } else if (location.hostname.indexOf("webidetesting") !== -1) {
								jQuery.sap.log.info("Discovered testing mode of the WebIDE. Tracking is deactivated.");
							 } else {
								jQuery.sap.log.error("The tracking DEMO_ID parameter is missing!");
							 }


			this.initiateWebSocket();

			jQuery.sap.require("sap.gantt.def.SvgDefs");
			jQuery.sap.require("sap.gantt.def.pattern.SlashPattern");
			jQuery.sap.require("sap.gantt.def.cal.CalendarDefs");
			jQuery.sap.require("sap.gantt.def.cal.TimeInterval");
			jQuery.sap.require("sap.gantt.def.cal.Calendar");
			jQuery.sap.require("sap.gantt.def.pattern.SlashPattern");
			jQuery.sap.require("sap.gantt.def.pattern.BackSlashPattern");
			jQuery.sap.require("sap.gantt.def.gradient.LinearGradient");
			sap.ui.getCore().getEventBus().subscribe("DLinkEvent", "DLinkEvent", this.__openDeviationLink, this);
			var oSvgDefs = new sap.gantt.def.SvgDefs({
				defs: [new sap.gantt.def.pattern.BackSlashPattern("pattern_backslash_red", {
						stroke: "#e30a0a",
						strokeWidth: 3,
						backgroundColor: "#d77d7d"
					}), new sap.gantt.def.pattern.SlashPattern("pattern_slash_grey", {
						stroke: "grey"
					}), new sap.gantt.def.pattern.SlashPattern("pattern_slash_lightblue", {
						stroke: "blue"
					}), new sap.gantt.def.pattern.SlashPattern("pattern_slash_orange", {
						stroke: "orange"
					}), new sap.gantt.def.pattern.SlashPattern("pattern_backslashFilled_gray", {
						stroke: "grey",
						strokeWidth: 1,
						tileWidth: 4,
						tileHeight: 4,
						backgroundColor: "none"
					}), new sap.gantt.def.pattern.BackSlashPattern("pattern_backslash_lightgreen", {
						stroke: "#5885ac",
						//stroke: "#00FA9A",
						strokeWidth: 3,
						//backgroundColor: "#6e91a0"
						backgroundColor: "#456a7b"
					}), new sap.gantt.def.pattern.BackSlashPattern("pattern_backslash_purple", {
						stroke: "#8e83a3",
						strokeWidth: 3,
						backgroundColor: "#9188a7"
					})
					/**, new sap.gantt.def.gradient.LinearGradient("gradient_linear_lightblue", {
										colorStops: [{
											offset: "to top",
											color: "#55b3e1 50%"
										}]
									})**/
				]
			});

			var oGanttChartContainer = this.getView().byId("GanttChartContainer");
			var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
			// var sPath = jQuery.sap.getModulePath("TurnAroundView", "/model/data.json");
			// var sPath = jQuery.sap.getModulePath("TurnAroundView", "/model/TA_V1.json");
				// var sPath = jQuery.sap.getModulePath("TurnAroundView", "/model/testData2.json");
		//	var sPath = "/destinations/NeoHANA/demo_mvp2/TA.xsjs";
		
		//	var sPath = "/destinations/NeoHANA/Read_hub_data/get_flight_ta.xsjs";
		
		//var sPath = jQuery.sap.getModulePath("TurnAroundView","/model/get_flight_ta.json");

		var sPath = "/api/ta/list";
			
			// var sPath = "/destinations/NeoHANA/Read_hub_data/get_flight_ta_v0.xsjs";
			// var sPath = "/destinations/NeoHANA/demo_mvp2/TA.xsjs";
			this._oModel = new JSONModel();
			//	this._oModel1 = new JSONModel();
			var that = this;
			
			
				$.ajax({
					url: sPath,
					type: 'GET',
					async: false,
				}).then(function(data) {
					//enable this for xsjs
				//	that._oModel.setData(JSON.parse(data));
					that._oModel.setData(data);
					// configuration of GanttChartContainer
					/**	var uniqueNames = [];
						var z = [{
							name: "All Flights",
							id: "00"
						}];**/
					//enable for xsjs
					//	var x = JSON.parse(data).root.children;
					//comment this line when xsjs is used
					//	var x = data.root.children;
					/**	for (var i = 0; i < x.length; i++) {
							if (uniqueNames.indexOf(x[i].name) === -1) {
								uniqueNames.push(x[i].name);
								z.push({
									name: x[i].name,
									id: x[i].id
								})
							}
						}**/
	
					/**	var odata = {
							"flightSet": z
						};
						that._oModel1.setData(odata);
						that.getView().setModel(that._oModel1, "testmodel")**/
					//that.getView().setModel(that._oModel, "testmodel")
					oGanttChartContainer.setModel(that._oModel, "EK");
					//	oGanttChartContainer.setLegendContainer(that._createLegendContainer());
					//	oGanttChartContainer.setToolbarSchemes(that._createToolbarSchemes());
					oGanttChartContainer.setContainerLayouts(that._createContainerLayouts());
					oGanttChartContainer.setContainerLayoutKey("sap.test.gantt_layout");
	
					//oGanttChartContainer.addCustomToolbarItem(that._createCustomToolbar());
	
					/*				
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					oGanttChartContainer._oToolbar._oZoomInButton.firePress();
					*/
	
					// configuration of GanttChartWithTable
					oGanttChartWithTable.bindAggregation("rows", {
						path: "EK>/root",
						parameters: {
							arrayNames: ["children"]
						}
					});
					oGanttChartWithTable.bindAggregation("relationships", {
						path: "EK>/root/relationship"
					});
					/*oGanttChartWithTable.bindAggregation("adhocLines", {
						path: "test>/root/adhocLines/0/",
						templateShareable: true,
						template: new sap.gantt.AdhocLine({
							stroke: "#8df7ed",
							strokeDasharray: "{strokeDasharray}",
							timeStamp: "20180101180000",
							description: "DayLight"
						})
					});*/
	
					/*oGanttChartContainer.enableAdhocLine();
					oGanttChartContainer.enableShapeTimeDisplay();*/
					/*oGanttChartWithTable.bindAggregation("adhocLines", {
						path: "test>/root/adhocLines"
					});*/
					oGanttChartWithTable.setTimeAxis(that._createTimeAxis());
					//	oGanttChartWithTable.setShapeDataNames(["rectangleselectgreycomb", "top", "order", "milestone", "constraint", "relationship"]);
					oGanttChartWithTable.setShapeDataNames([
						/*"cusTextShapeTaskGroup",*/
						"cusTextWhiteTask", "flightfromtodetails", "flightinfo", "oGreyDiamondConfig",
						"oOrangeDiamondConfig",
						"flightduration", "nodelay", "confirmeddelay", "waitingtime", "expecteddelay", "maintenance", "flighttimedetails",
						"maintenancetext",
						"waitingtimestart", "waitingtimeend",
						"towing", "image", "waiting", "ExpectedDelayText", "ConfirmedDelayText", "waitstartText", "waitendText", "iconfont", "image",
						"relationship"
					]);
					/*oGanttChartWithTable.setShapeDataNames(["selectrectangle", "uptriangle", "rectangle", "greyrectangle",
						"cusTextShapeTaskGroup", "oCusTextWhiteTaskConfig", "oCusTextBlackTaskConfig", "oGreyDiamondConfig",
						"oOrangeDiamondConfig",
						"chevron", "greenchevron", "redchevron", "strokechevronred", "strokechevronblue", "CusTimeTextBlack",
						"strokechevronlightgreen", "image", "bluechevron", "CusTextWhiteTaskEnd", "CusTextWhiteTaskOver", "iconfont", "image",
						"relationship"
					]);*/
					oGanttChartWithTable.setShapes(that._configShape());
					oGanttChartWithTable.setSvgDefs(oSvgDefs);
					//	oGanttChartWithTable.setToolbarSchemes(that._createToolbarSchemes());
					oGanttChartWithTable.setSelectionMode(sap.gantt.SelectionMode.None);
					//oGanttChartContainer.setEnableTimeScrollSync(false);
					//oGanttChartContainer.setEnableVerticalLine(false);
					oGanttChartContainer.setEnableCursorLine(false);
				});
		



				setInterval(() => {					
					that.onActivityRefresh();
				}, 3000);


		},
		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		onReset: function () {
			var model = this.getView().getModel("EK");

			// The API is expecting a string!
			model.setProperty("/step", "1", null, true);
			model.firePropertyChange();
		},
		stepChange: function (evt) {
			var selectedStep = evt.getSource().getSelectedKey();
			if ((!webSocket) || (webSocket.getReadyState() == 3)) {
				this.initiateWebSocket();
			}
			var model = this.getView().getModel("EK");

			// The API is expecting a string!
			model.setProperty("/step", selectedStep, null, true);
			model.firePropertyChange();
		},
		initiateWebSocket: function () {
			var self = this;
			webSocket = new WebSocket(`/websocket/stepper`);

			// When the connection is opened
			webSocket.attachOpen(null, () => {

			});

			webSocket.attachMessage(null, function (message) {
				var model = new JSONModel();

				model.setData(JSON.parse(message.getParameter("data")));

				model.attachPropertyChange(evt => {
					var dataObj = evt.getSource().getData();

					webSocket.send(JSON.stringify(dataObj));

					MessageToast.show("Data updated successfully.");
				});

				self.getView().setModel(model, "EK");
			}, this);
		},
		onActivityRefresh: function() {
			var that = this,
				length = sap.ui.getCore().byId("__xmlview0--ganttView").getRows().length,
				expandedStatus = [],
				j = 0;

			for (var i = 0; i < length; i++) {
				if ($("#__table0-rows-row" + i)[0].getAttribute("aria-level") == "1") {
					var tempJSON = {
						"rowNo": "",
						"expanded": "false"
					};
					tempJSON.rowNo = j;
					if ($("#__table0-rows-row" + i)[0].getAttribute("aria-expanded") == "true") {
						tempJSON.expanded = "true";
					}
					expandedStatus.push(tempJSON);
					j++;
				}
			}

			//	var sPath = jQuery.sap.getModulePath("PTS", "/model/data.json");
			//	var sPath = "/destinations/NeoHANA/Read_hub_data/read_pts_output.xsjs";
		//	var sPath = "/destinations/NeoHANA/demo_mvp2/TA.xsjs";
		//	var sPath = "/destinations/NeoHANA/Read_hub_data/get_flight_ta.xsjs";
		
		//var sPath = jQuery.sap.getModulePath("TurnAroundView","/model/get_flight_ta.json"); // working
		var sPath =  "/api/ta/list";
		//	var sPath = "./model/get_flight_ta.json";
			//var sPath = jQuery.sap.getModulePath("PTS", "/model/testData2.json");
			//	var sPath = "https://10.112.3.84:4300/Read_hub_data/read_pts_output.xsjs";

			this._oModel = new JSONModel();
			var that = this;
			$.ajax({
				url: sPath,
				type: 'GET',
				async: true,
			}).then(function(data) {
			//	data = JSON.parse(data);
				that._oModel.setData(data);
				// configuration of GanttChartContainer
				that.getView().byId("GanttChartContainer").setModel(that._oModel, "EK");
				that.getView().byId("GanttChartContainer").getModel("EK").refresh();

				//	oGanttChartContainer.setLegendContainer(that._createLegendContainer());
				//	oGanttChartContainer.setToolbarSchemes(that._createToolbarSchemes());
				//	oGanttChartContainer.setContainerLayouts(that._createContainerLayouts());
				//	oGanttChartContainer.setContainerLayoutKey("sap.test.gantt_layout");
				//	oGanttChartContainer.addCustomToolbarItem(that._createCustomToolbar());
				var length = sap.ui.getCore().byId("__xmlview0--ganttView").getRows().length;

				for (var i = length; i >= 0; i--) {
					if (expandedStatus[i] != undefined) {
						if (expandedStatus[i].expanded == "true") {
							$("#__table0-rows-row" + i + "-treeicon").click();
						}
					}
				}
				/*	var msg = 'Data Sync Successful !!!';
					if(toggleMsg)
				   		MessageToast.show(msg);*/
				/*that._getCounter(); */
			});
		},

		onAfterRendering: function() {
			//	this._onEIBTDialog();

			var that = this;

			//Start Chart

			class Axis {
				constructor(ticks) {
					this.ticks = ticks;
				}

				CreateScale(from, to) {
					this.scale =
						d3.scalePoint()
						.domain(this.ticks)
						.range([from, to]);
				}

				Render(parent) {
					let axis = parent
						.append("g")
						.attr("class", "axis");

					let ticks = axis
						.selectAll(".ticks")
						.data(this.ticks)
						.enter()
						.append("text")
						.text(d => d)
						.attr("class", "ticks")
						.attr("x", d => this.scale(d))
				}
			}

			class Section {
				constructor(width, height, background) {
					this.width = width;
					this.height = height;
					this.background = background;
					this.segments = [];
					this.axes = [];
				}

				AddAxis(axis) {
					this.axes.push(axis);
				}

				AddSegments(segments) {
					for (const [id, segment] of segments.entries()) {
						this.segments.push({
							index: id + 1,
							markers: segment
						});
					}

					this.CreateScale();
					this.GenerateSegmentPoints();
				}

				CreateScale() {

					this.scale =
						d3.scale.ordinal()
						.domain(this.segments.map(d => d.index))
						.rangeBands([0, this.width]);

					/*	this.scale =
							d3.scaleBand()
							.domain(this.segments.map(d => d.index))
							.range([0, this.width]);*/
				}

				GenerateSegmentPoints() {
					let sPoints = [];

					for (let i = 0; i < this.segments.length; i++) {
						let iPoints = [{
							x: this.scale(this.segments[i].index),
							y: this.height / 2
						}];

						if (this.segments[i + 1] != undefined) {
							iPoints.push({
								x: this.scale(this.segments[i + 1].index),
								y: this.height / 2
							})
						} else {
							iPoints.push({
								x: this.width,
								y: this.height / 2
							})
						}

						sPoints.push(iPoints);
					}

					return sPoints;
				}

				Render(parent) {
					// Needed to access the data from within each() without losing reference to the selected el.
					const segmentsData = this.segments;
					const markersData = () => {
						let markers = [];

						for (const [i, segment] of segmentsData.entries()) {
							for (const [j, marker] of segment.markers.entries()) {
								if (marker.position == "start") {
									marker['x-coordinate'] = this.scale(segment.index);
								} else {
									if (i == segmentsData.length - 1) {
										marker['x-coordinate'] = this.width;
									} else {
										marker['x-coordinate'] = this.scale(segment.index + 1);
									}
								}

								markers.push(marker);
							}
						}

						return markers;
					}

					// Group rendered objects
					let section = parent
						.append("g")
						.attr("class", "section");

					// Render background
					if (this.background) {
						let background = section
							.append("rect")
							.attr("width", this.width)
							.attr("height", this.height - 5)
							.attr("class", "background");
					}

					// Render horizontal lines
					let horizontalLines = section
						.selectAll("path.horizontal")
						.data(this.GenerateSegmentPoints())
						.enter()
						.append("path")
						.attr("d", d3.svg.line().x(d => d.x).y(d => d.y))
						.attr("id", (d, i) => `horizontal-line-${++i}`)
						.attr("class", "horizontal");

					// Render markers
					let markers = horizontalLines
						.each(function(d, i) {
							let line = d3.select(this)

							for (const marker of segmentsData[i].markers) {
								if (marker.position == "start") {
									line.attr("marker-start", "url(#segment)");
								} else {
									line.attr("marker-end", "url(#segment)");
								}
							}
						});

					// Render vertical lines
					let verticalLines = section
						.selectAll("line.vertical")
						.data(markersData())
						.enter()
						.append("line")
						.attr("x1", d => d['x-coordinate'])
						.attr("y1", this.height / 2)
						.attr("x2", d => d['x-coordinate'])
						.attr("y2", this.height)
						.attr("id", (d, i) => {
							return `vertical-line-${++i}`;
						})
						.attr("class", "vertical");

					// Render data labels (TODO: fix alignment)
					let labels = section
						.selectAll("text")
						.data(markersData())
						.enter()
						.append("text")
						.text(d => {
							return d.label;
						})
						.attr("x", d => d['x-coordinate'])
						.attr("y", this.height / 2)
						.attr("transform", d => d.icon == undefined ? `translate(${0}, ${-10})` : `translate(${12.5}, ${-10})`)
						.attr("class", "labels");

					// Render icons
					let icons = section
						.selectAll(".icon")
						.data(markersData())
						.enter()
						.append("image")
						.attr("x", d => d['x-coordinate'])
						.attr("y", this.height / 2)
						.attr("transform", `translate(${-8}, ${-22.5})`)
						.attr("class", "icon")
						.attr("width", "17.5px")
						.attr("height", "17.5px")
						.attr("href", d => d.icon);

					// Render axes
					for (const axis of this.axes) {

						axis.CreateScale(-10, this.width - 2.5)
						axis.Render(section);
					}

					// Render axes
					d3.selectAll(".axis")
						.attr("transform", (d, i) => `translate(${0}, ${this.height / 2 + 15 + (i * 12.5)})`)
						.attr("id", (d, i) => `axis-${++i}`);
				}
			}

			class Timeline {
				constructor(dimension, margin) {
					this.dimension = dimension;
					this.margin = margin;
					this.sections = [];
					this.definitions = [];
				}

				AddSection(section) {
					this.sections.push(section);
				}

				AddDefinition(definition) {
					this.definitions.push(definition);
				}

				Render(parent) {
					// Render canvas
					let canvas =
						d3.select(parent)
						.append("svg")
						.attr("width", this.dimension.width + this.margin.left + this.margin.right)
						.attr("height", this.dimension.height + this.margin.top + this.margin.bottom)
						.append("g")
						.attr("class", "timeline")
						.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

					// Add user definitions
					let definitions =
						canvas
						.append("defs");

					this.definitions.forEach(definition => {
						definition.call(definition, definitions);
					});

					// Add a definition for markers
					let markers =
						definitions
						.append("marker")
						.attr("id", "segment")
						.attr("markerWidth", 10)
						.attr("markerHeight", 10)
						.attr("refX", 5)
						.attr("refY", 5)
						.attr("class", "gray-marker")
						.append("circle")
						.attr("cx", 5)
						.attr("cy", 5)
						.attr("r", 3);

					// Render each section
					let offset = 0;

					for (const [id, section] of this.sections.entries()) {
						section.Render(canvas);

						// Groups were used to facilitate horizontal translation
						d3.select(".section:last-child")
							.attr("id", `section-${id + 1}`)
							.attr("transform", `translate(${offset}, 0)`);

						offset += section.width;
					}
				}
			}

			// Canvas dimensions and margins
			const dimension = {
				width: 1110,
				height: 50
			};

			const margin = {
				top: 0,
				bottom: 0,
				left: 20,
				right: 10
			};

			// Segments of each section in the timeline
			//reading hours from service/data model
			/*	const hours = [
					[{
						label: '6:00',
						position: 'start'
					}],
					[{
						label: '7:00',
						position: 'start'
					}],
					[{
						label: '8:00',
						position: 'start'
					}],
					[{
						label: '9:00',
						position: 'start'
					}],
					[{
						label: '10:00',
						position: 'start'
					}],
					[{
						label: '11:00',
						position: 'start'
					}],
					[{
						label: '12:00',
						position: 'start'
					}],
					[{
						label: '13:00',
						position: 'start'
					}],
					[{
						label: '14:00',
						position: 'start'
					}],
					[{
						label: '15:00',
						position: 'start'
					}],
					[{
						label: '16:00',
						position: 'start'
					}],
					[{
						label: '17:00',
						position: 'start'
					}],
					[{
						label: '18:00',
						position: 'start'
					}],
					[{
						label: '19:00',
						position: 'start'
					}],
					[{
						label: '20:00',
						position: 'start'
					}],
					[{
						label: '21:00',
						position: 'start'
					}],
					[{
						label: '22:00',
						position: 'start'
					}],
					[{
						label: '23:00',
						position: 'start'
					}],
					[{
						label: '0:00',
						position: 'start'
					}],
					[{
						label: '1:00',
						position: 'start'
					}],
					[{
						label: '2:00',
						position: 'start'
					}],
					[{
						label: '3:00',
						position: 'start'
					}],
					[{
						label: '4:00',
						position: 'start'
					}, {
						label: '5:00',
						position: 'end'
					}]

				] */

			// d3.range(12).map(d => {
			//     const time = (new Date()).setUTCHours(++d, 0);
			//     const format = d3.timeFormat("%I:%M");

			//     return format(new Date(time + d * 60000));

			//     return { label: d, position: "start" };
			// });

			// Create sections with widths as fractions of the total canvas width
			const segments = new Section(dimension.width, dimension.height, false);
			//segments.AddSegments(hours);

			const hours = that.getView().byId("GanttChartContainer").getModel("EK").getData().root.timeInterval;

			segments.AddSegments(hours);

			// Create timeline and add sections to it
			const timeline = new Timeline(dimension, margin);
			timeline.AddSection(segments);

			// Add custom SVG definition for a gradient background
			// timeline.AddDefinition((el) => {
			//     const gradient = el
			//         .append("linearGradient")
			//         .attr("id", "landed-background")
			//         .attr("x1", "0%")
			//         .attr("y1", "100%")
			//         .attr("x2", "100%")
			//         .attr("y2", "100%");

			//     gradient
			//         .append("stop")
			//         .attr("offset", "0%")
			//         .style("stop-color", "#00B7FF");

			//     gradient
			//         .append("stop")
			//         .attr("offset", "100%")
			//         .style("stop-color", "#FFD900");
			// });

			// Add axis to the second segment
			// const diff = d3.range(-120, 5, 5);
			// const times = diff.map(d => {
			//     const time = (new Date()).getTime();
			//     const format = d3.timeFormat("%I:%M");

			//     return format(new Date(time + d * 60000));
			// });

			// landed.AddAxis(new Axis(diff));
			// landed.AddAxis(new Axis(times));

			// Render timeline
			timeline.Render("#__xmlview0--ChartHolder");

			//End Chart
			//	that.onDeviationDialog();
		/*	that._getCounter(); */
			// var oAutoRefresh = window.setInterval(function() {
			// 	that.onActivityRefresh();
			// }, 1000);

			setTimeout(function() {
				var oGanttChartContainer = that.getView().byId("GanttChartContainer");
				var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
				//	oGanttChartWithTable.jumpToPosition(new Date("2018-03-08"));

				/*	
				oGanttChartContainer._oToolbar._oZoomInButton.firePress();
				oGanttChartContainer._oToolbar._oZoomInButton.firePress();
oGanttChartContainer._oToolbar._oZoomInButton.firePress();
oGanttChartContainer._oToolbar._oZoomInButton.firePress();
*/

				//oGanttChartWithTable.jumpToPosition(new Date("2018-03-08T05:00:00"));			

			}, 1000);
		},

		/*
		 * Create CustomToolbar
		 * @private
		 * @returns {Object} oToolbar
		 */

		/*
		 * Create ToolbarSchemes
		 * @private
		 * @returns {Array} aToolbarSchemes
		 */

		_createCustomToolbar: function() {
			var that = this;
			var listItem = new sap.ui.core.ListItem({
				key: '{text}',
				text: {
					path: 'text'
				},
				tooltip: '{text}'
			});
			var oToolbar = new sap.m.Toolbar({
				content: [
					new sap.m.ComboBox({
						items: listItem,
						change: function() {
							that._searchTable();
						}
					}),
					new sap.m.ToolbarSpacer({
						width: "10px"
					}),
					new sap.m.Link({
						text: "Delete Task",
						press: function() {
							that.deleteTask();
						}
					}),
					new sap.m.ToolbarSpacer({
						width: "10px"
					}),
					new sap.m.ToolbarSeparator()
				]
			});

			return oToolbar;
		},
		_searchTable: function(oEvent) {

			var that = this;

		},
		_createToolbarSchemes: function() {
			var aToolbarSchemes = [
				new sap.gantt.config.ToolbarScheme({
					key: "GLOBAL_TOOLBAR",
					customToolbarItems: new sap.gantt.config.ToolbarGroup({
						position: "R2",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					timeZoom: new sap.gantt.config.ToolbarGroup({
						position: "R9",
						overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow
					}),
					legend: new sap.gantt.config.ToolbarGroup({
						position: "R3",
						overflowPriority: sap.m.OverflowToolbarPriority.Low
					}),
					settings: new sap.gantt.config.SettingGroup({
						position: "R1",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						items: sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS
					}),
					toolbarDesign: sap.m.ToolbarDesign.Transparent
				}),
				new sap.gantt.config.ToolbarScheme({
					key: "LOCAL_TOOLBAR"
				})
			];

			return aToolbarSchemes;
		},

		/*
		 * Create ContainerLayouts
		 * @private
		 * @returns {Array} aContainerLayouts
		 */
		_createContainerLayouts: function() {
			var aContainerLayouts = [
				new sap.gantt.config.ContainerLayout({
					key: "sap.test.gantt_layout",
					text: "Gantt Layout",
					toolbarSchemeKey: "GLOBAL_TOOLBAR"
				})
			];

			return aContainerLayouts;
		},

		/*
		 * Create Legend
		 * @private
		 * @returns {Object} oLegend
		 */
		_createLegendContainer: function() {
			var sSumTaskColor = "#FAC364";
			var sTasksColor = "#5CBAE5";
			var sRelColor = "#848F94";
			var sTextColor = sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb" ? "white" : "";
			var oLegend = new sap.gantt.legend.LegendContainer({
				legendSections: [
					new sap.m.Page({
						title: "Tasks",
						content: [
							new sap.ui.core.HTML({
								content: "<div width='100%' height='50%' style='margin-top: 25px'><svg width='180px' height='60px'><g>" +
									"<g style='display: block;'>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") + "' y='2' width='20' height='20' fill=" +
									sSumTaskColor + " style='stroke: " + sSumTaskColor + "; stroke-width: 2px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='16' font-size='0.875rem' fill=" +
									sTextColor + ">Summary task</text></g>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") +
									"' y='32' width='20' height='20' fill=" + sTasksColor + " style='stroke: " + sTasksColor +
									"; stroke-width: 2px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='46' font-size='0.875rem' fill=" +
									sTextColor + ">Task</text></g>" +
									"</g></g></svg></div>"
							})
						]
					}),
					new sap.m.Page({
						title: "Relationships",
						content: [
							new sap.ui.core.HTML({
								content: "<div width='100%' height='50%' style='margin-top: 25px'><svg width='180px' height='25px'><g>" +
									"<g style='display: block;'>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") + "' y='8' width='20' height='1' fill=" +
									sRelColor + " style='stroke: " + sRelColor + "; stroke-width: 1px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='12.5' font-size='0.875rem' fill=" +
									sTextColor + ">Relationship</text></g>" +
									"</g></g></svg></div>"
							})
						]
					})
				]
			});

			return oLegend;
		},

		/*
		 * Configuration of Shape.
		 * @private
		 * @returns {Array} aShapes
		 */
		_configShape: function() {
			var aShapes = [];

			// define a milestone (diamond)

			// define a constraint config

			sap.ui.define(["sap/gantt/shape/Text"], function(Text) {
				var MyText = Text.extend("sap.test.MyText");
				MyText.prototype.getY = function(oData, oRowInfo) {
					//	var _x = this.getX(oData, oRowInfo);
					//	var _y = this.getY(oData, oRowInfo);
					return oRowInfo.y + 27;
				};
				return MyText;
			}, true);

			sap.ui.define(["sap/gantt/shape/Text"], function(Text) {
				var MyText1 = Text.extend("sap.test.MyText1");
				MyText1.prototype.getY = function(oData, oRowInfo) {
					//	var _x = this.getX(oData, oRowInfo);
					//	var _y = this.getY(oData, oRowInfo);
					return oRowInfo.y + 20;
				};
				return MyText1;
			}, true);

			sap.ui.define(["sap/gantt/shape/Text"], function(Text) {
				var MyText2 = Text.extend("sap.test.MyText2");
				MyText2.prototype.getY = function(oData, oRowInfo) {
					//	var _x = this.getX(oData, oRowInfo);
					//	var _y = this.getY(oData, oRowInfo);
					return oRowInfo.y + 4;
				};
				return MyText2;
			}, true);

			/*var oCusTextShapeTaskGroupConfig = new sap.gantt.config.Shape({
				key: "TextShape",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "cusTextShapeTaskGroup",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					title: "text",
					fill: "#000000"
				}
			});*/

			var oCusTextWhiteTaskConfig = new sap.gantt.config.Shape({
				key: "CusTextWhite",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "cusTextWhiteTask",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					fill: "#FFFFFF",
					fontFamily: "HelveticaNeue"
				}
			});

			var oCusTextBlackTaskConfig = new sap.gantt.config.Shape({
				key: "flightfromtodetails",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "flightfromtodetails",
				level: 1,
				shapeProperties: {
					time: "{time}",
					fontSize: "{fontSize}",
					text: "{text}",
					fill: "{fill}",
					wrapWidth: "30px",
					fontFamily: "{fontFamily}"
				}
			});

			/**var sText = oCusTextBlackTaskConfig.getShapeProperty("text");
			sText = sText === "ZRH" ? "TestTrue" : "TestFalse";
			oCusTextBlackTaskConfig.setShapeProperties({
				time: "{time}",
				fontSize: "{fontSize}",
				text: sText,
				fill: "#6d9ac8",
				wrapWidth: "30px",
				fontFamily: "EK03Plain-L01"
			});**/

			//oImage.bindProperty("src", "/company/trusted", function(bValue) {
			//return bValue ? "green.png" : "red.png";
			//}); 

			var oCusTextGreyConfig = new sap.gantt.config.Shape({
				key: "flightinfo",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "flightinfo",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					//title: "Flight Info",
					fill: "#000000",
					fontFamily: "HelveticaNeue"
				}
			});

			var oChevronConfig = new sap.gantt.config.Shape({
				key: "flightduration",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "flightduration",
				level: 1,
				shapeProperties: {
					fill: "#FFFFFF",
					time: "{startTime}",
					endTime: "{endTime}",
					title: "{title}",
					// fillOpacity: "0.4",
					height: "25"
				}
			});
			
			var oGreenChevronConfig = new sap.gantt.config.Shape({
				key: "nodelay",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "nodelay",
				level: 1,
				shapeProperties: {
					fill: "#009488",
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "No Delay",
					height: "25"
				}
			});
			var oRedChevronConfig = new sap.gantt.config.Shape({
				key: "confirmeddelay",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "confirmeddelay",
				level: 1,
				shapeProperties: {
					fill: "#ca0908",
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "Confirmed Delay",
					height: "25"
				}
			});
			var oRedChevronConfig1 = new sap.gantt.config.Shape({
				key: "waitingtime",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "waitingtime",
				level: 1,
				shapeProperties: {
					//fill: "{fill}",
					//fill: "url(#gradient_linear_lightblue)",
					fill: "#7ac4c2",
					fillOpacity: "0.7",
					time: "{startTime}",
					endTime: "{endTime}",
					title: "PTS",
					height: "25"
				}
			});
			
			var oStrokeChevronRedShape = new sap.gantt.config.Shape({
				key: "expecteddelay",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "expecteddelay",
				level: 1,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "Expected Delay",
					fill: "url(#pattern_backslash_red)",
					stroke: "red",
					height: "25"
				}
			});
			var oStrokeChevronPurpleShape = new sap.gantt.config.Shape({
				key: "maintenance",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "maintenance",
				level: 1,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "Maintenance", 
					fill: "url(#pattern_backslash_purple)",
					stroke: "red",
					height: "25"
				}
			});
			var oCusTimeTextBlackTaskConfig = new sap.gantt.config.Shape({
				key: "flighttimedetails",
				shapeClassName: "sap.test.MyText",
				shapeDataName: "flighttimedetails",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					fill: "#000000",
					fontFamily: "HelveticaNeue"
				}
			});

			var oMaintenanceTimeConfig = new sap.gantt.config.Shape({
				key: "maintenancetext",
				shapeClassName: "sap.test.MyText1",
				shapeDataName: "maintenancetext",
				level: 2,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					title: "Maintenance Timings",
					fill: "#ffffff",
					fontFamily: "HelveticaNeue"
				}
			});
			var oWaitingtimestarttextConfig = new sap.gantt.config.Shape({
				key: "waitingtimestart",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "waitingtimestart",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					//title: "PTS Start",
					fill: "#ffffff",
					wrapWidth: "30px",
					fontFamily: "HelveticaNeue"
				}
			});
			var oWaitingtimeendtextConfig = new sap.gantt.config.Shape({
				key: "waitingtimeend",
				shapeClassName: "sap.test.MyText",
				shapeDataName: "waitingtimeend",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					title: "PTS End",
					fill: "#ffffff",
					fontFamily: "HelveticaNeue"
				}
			});
			var oStrokeChevronLightGreenShape = new sap.gantt.config.Shape({
				key: "towing",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "towing",
				level: 1,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "Towing",
					fill: "url(#pattern_backslash_lightgreen)",
					stroke: "red",
					height: "25"
				}
			});

			var oImageConfig = new sap.gantt.config.Shape({
				key: "image",
				shapeClassName: "sap.gantt.shape.Image",
				shapeDataName: "image",
				level: 1,
				shapeProperties: {
					time: "{time}",
					iconName: "{iconName}",
					image: "sap-icon://wrench",
					//title: "image"
				}
			});
			var oBlueChevronConfig = new sap.gantt.config.Shape({
				key: "waiting",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "waiting",
				level: 1,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					//title: "PTS",
					fill: "#6cacba",
					height: "30"

				}
			});

			var oCusTextWhiteTaskEndConfig = new sap.gantt.config.Shape({
				key: "ExpectedDelayText",
				shapeClassName: "sap.test.MyText2",
				shapeDataName: "ExpectedDelayText",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					//title: "Expected Delay",
					fill: "#FFFFFF",
					fontFamily: "HelveticaNeue"
				}
			});
			var oCusTextWhiteTaskOverConfig = new sap.gantt.config.Shape({
				key: "ConfirmedDelayText",
				shapeClassName: "sap.test.MyText2",
				shapeDataName: "ConfirmedDelayText",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					//title: "Confirmed Delay",
					fill: "#FFFFFF",
					fontFamily: "HelveticaNeue"
				}
			});
			var oCusTextWhiteTaskOverConfig1 = new sap.gantt.config.Shape({
				key: "waitstartText",
				shapeClassName: "sap.gantt.shape.Text",
				shapeDataName: "waitstartText",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					/*fontSize: "{fontSize}",*/
					fontSize: "{fontSize}",
					//title: "PTS Time",
					fill: "#FFFFFF",
					fontFamily: "HelveticaNeue"
				}
			});
			var oCusTextWhiteTaskOverConfig2 = new sap.gantt.config.Shape({
				key: "waitendText",
				shapeClassName: "sap.test.MyText",
				shapeDataName: "waitendText",
				level: 1,
				shapeProperties: {
					time: "{time}",
					text: "{text}",
					fontSize: "{fontSize}",
					//title: "PTS Time",
					fill: "#FFFFFF",
					fontFamily: "HelveticaNeue"
				}
			});
			var oIconfontConfig = new sap.gantt.config.Shape({
				key: "iconfont",
				shapeClassName: "sap.gantt.shape.ext.Iconfont",
				shapeDataName: "iconfont",
				level: 1,
				shapeProperties: {
					time: "{time}",
					name: "{iconfontName}",
					fontSize: 15,
					//title: "Icon"
				}
			});
			var oImageConfig = new sap.gantt.config.Shape({
				key: "image",
				shapeClassName: "sap.gantt.shape.Image",
				shapeDataName: "image",
				level: 1,
				shapeProperties: {
					time: "{time}",
					iconName: "{iconName}",
					image: "media/images/{iconName}.svg",
					//image: "/webapp/image/{iconName}.svg",
					title: "{iconName}",
					width: 15,
					height: 15
				}
			});

			/*var oChevronRedShape = new sap.gantt.config.Shape({
				key: "redchevron",
				shapeClassName: "sap.gantt.shape.ext.Chevron",
				shapeDataName: "redchevron",
				level: 1,
				shapeProperties: {
					fill: "#AD2929",
					time: "{startTime}",
					endTime: "{endTime}",
					title: "chevron",
					height: "30"
				}
			});*/
			//	aShapes = [oTopShape, oOrderShape, oDiamondConfig, oTaskCShape, oRelShape];
			//	aShapes = [RECTSelectGrayCombinationShape, oRectangleULShape, oOrderShape, oDiamondConfig, oTaskCShape, oRelShape];
			/*aShapes = [oSelectRectangleConfig, oTriangleConfig, oRectangleConfig, oRectangleGreyConfig, oCusTextShapeTaskGroupConfig,
				oCusTextShapePercentageConfig, oCusTextWhiteTaskConfig, oCusTextBlackTaskConfig, oGreyDiamondConfig, oOrangeDiamondConfig,
				oChevronConfig,
				oGreenChevronConfig, oRedChevronConfig, oStrokeChevronRedShape, oStrokeChevronBlueShape, oCusTimeTextBlackTaskConfig,
				oStrokeChevronLightGreenShape,
				oImageConfig, oBlueChevronConfig, oCusTextWhiteTaskEndConfig, oCusTextWhiteTaskOverConfig, oIconfontConfig,oImageConfig,
				oRelShape
			];*/
			aShapes = [ /*oCusTextShapeTaskGroupConfig,*/
				oCusTextWhiteTaskConfig, oCusTextBlackTaskConfig, oCusTextGreyConfig,
				oChevronConfig,
				oGreenChevronConfig, oRedChevronConfig, oRedChevronConfig1, oStrokeChevronRedShape, oStrokeChevronPurpleShape,
				oCusTimeTextBlackTaskConfig,
				oMaintenanceTimeConfig, oWaitingtimestarttextConfig, oWaitingtimeendtextConfig,
				oStrokeChevronLightGreenShape,
				oImageConfig, oBlueChevronConfig, oCusTextWhiteTaskEndConfig, oCusTextWhiteTaskOverConfig, oCusTextWhiteTaskOverConfig1,
				oCusTextWhiteTaskOverConfig2,
				oIconfontConfig, oImageConfig

			];
			/*oGanttChartWithTable.setShapeDataNames(["selectrectangle", "uptriangle", "rectangle", "greyrectangle",
					"cusTextShapeTaskGroup", "cusTextShapePercentage", "oCusTextWhiteTaskConfig", "oCusTextBlackTaskConfig", "oGreyDiamondConfig",
					"oOrangeDiamondConfig",
					"chevron", "greenchevron", "strokechevronred", "CusTimeTextBlack", "redchevron",
					"relationship"
				]);*/

			return aShapes;
		},

		formatTitle: function(sTitle) {
			return sTitle + "TEST";
		},

		/*
		 * Handle Date Change.
		 * @public
		 * @param {Object} event
		 * @returns undefined
		 */
		handleDateChange: function(event) {
			var oDatePicker = event.getSource();
			var aCells = oDatePicker.getParent().getCells();

			if (oDatePicker === oDatePicker.getParent().getCells()[1]) {
				this._checkDate(aCells[1], aCells[2], true);
			} else {
				this._checkDate(aCells[1], aCells[2], false);
			}
		},

		/*
		 * Check Date.
		 * @private
		 * @param {Object} startCell, {Object} endCell, {Boolean} bIsChangeStart
		 * @returns undefined
		 */
		_checkDate: function(startCell, endCell, bIsChangeStart) {
			if (bIsChangeStart === undefined) {
				jQuery.sap.log.error("bIsChangeStart is not defined!");
				return;
			}

			if (startCell.getValue() > endCell.getValue()) {
				this._showNotAllowedMsg();
				if (bIsChangeStart) {
					startCell.setValue(endCell.getValue());
				} else {
					endCell.setValue(startCell.getValue());
				}
			}
		},

		/*
		 * Show "Not Allowed" message.
		 * @private
		 * @returns undefined
		 */
		_showNotAllowedMsg: function() {
			MessageToast.show("Not allowed");
		},

		/*
		 * Handle event of shapeDragEnd
		 * @public
		 * @param {Object} [oEvent] event context
		 * @returns {Boolean} if Drag and Drop succeed
		 */
		handleShapeDragEnd: function(oEvent) {
			var oParam = oEvent.getParameters();
			var aSourceShapeData = oParam.sourceShapeData;
			var oSourceShapeData = aSourceShapeData[0].shapeData;
			var sSourceId = aSourceShapeData[0].objectInfo.id;
			var oTargetData = oParam.targetData;

			//change the form of date from millis to timestamp
			var sTarStartTime = sap.gantt.misc.Format.dateToAbapTimestamp(new Date(oTargetData.mouseTimestamp.startTime));
			var sTarEndTime = sap.gantt.misc.Format.dateToAbapTimestamp(new Date(oTargetData.mouseTimestamp.endTime));

			if (!oTargetData.objectInfo) {
				this._showNotAllowedMsg();
				return false;
			}

			var sTargetId = oTargetData.objectInfo.id;
			var sId = aSourceShapeData[0].objectInfo.id;

			if (this._checkDropSameRow(sSourceId, sTargetId) && this._selectOnlyOneRow(aSourceShapeData)) {
				//oSourceShapeData is a reference, so we only need to change startTime and endTime, then reset data model 
				oSourceShapeData.startTime = sTarStartTime;
				oSourceShapeData.endTime = sTarEndTime;
				var oModelData = this._oModel.getData();
				this._oModel.setData(oModelData);
				return true;
			} else {
				this._showNotAllowedMsg();
				return false;
			}
		},

		/*
		 * Check if drop the selected task to the same row
		 * @private
		 * @param {String} [sSourceId] source id
		 * @param {String} [sTargetId] target id
		 * @returns {Boolean} if drop the selected task in the same row
		 */

		/*
		 * Check if only select one row of chart
		 * @private
		 * @param {Array} [aSourceShapeData] array of source data
		 * @returns {Boolean} if only select one row of chart
		 */

		/*
		 * Create TimeAxis
		 * @private
		 * @returns {Object} oTimeAxis
		 */
		_createTimeAxis: function() {
			var oTimeAxis = new sap.gantt.config.TimeAxis({
				/*planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20180318060000",
					endTime: "20180319050000"
				}),
			
				initHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20180318060000",
					endTime: "20180319050000"*/

				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonStartTime ,//"20180218060000", //this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonStartTime,
					endTime: this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonEndTime
				}),

				initHorizon: new sap.gantt.config.TimeHorizon({
					startTime: this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonStartTime, //this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonStartTime,
					endTime: this.getView().byId("GanttChartContainer").getModel("EK").getData().root.horizonEndTime
				}),
				zoomStrategy: {
					"5min": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.minute,
							span: 5,
							range: 20
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							pattern: "HH"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.minute,
							span: 5,
							pattern: "HH"
						}
					},
					"1hour": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							range: 12
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							pattern: "dd.M.yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							pattern: "HH"
						}
					},
					"1day": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							pattern: "MMM yyyy,'Week' ww"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							pattern: "EEE dd"
						}
					},
					"1week": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							pattern: "MMMM yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							pattern: "'CW' w"
						}
					},
					"1month": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							pattern: "yyyy, QQQ"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							pattern: "MMM"
						}
					},
					"1quarter": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							pattern: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							pattern: "QQQ"
						}
					},
					"1year": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 10,
							pattern: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							pattern: "yyyy"
						}
					}
				},
				granularity: "1day",
				finestGranularity: "1hour",
				coarsestGranularity: "1week",
				// granularity: "1week",
				// finestGranularity:  "1day",
				// coarsestGranularity:  "1year",
				rate: 1
			});

			//granularity: "1day",
			//				finestGranularity:  "1hour",
			//				coarsestGranularity:  "1week",

			return oTimeAxis;

			/*
			
				var oTimeAxis = new sap.gantt.config.TimeAxis({
				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20180228000000",
					endTime: "20180309000000"
				}),
				//"20131228000000", Chinmaya 
				// specify initHorizon rather than the default one
				initHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20180226000000",
					endTime: "20180311000000"
				}),
				zoomStrategy: {
					"1hour": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							range: 20
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							pattern: "dd.M.yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							pattern: "HH:mm"
						}
					},
					"1day": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							pattern: "MMM yyyy,'Week' ww"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							pattern: "EEE dd"
						}
					},
					"1week": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							pattern: "MMMM yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							pattern: "'CW' w"
						}
					},
					"1month": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							pattern: "yyyy, QQQ"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							pattern: "MMM"
						}
					},
					"1quarter": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							pattern: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							pattern: "QQQ"
						}
					},
					"1year": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 10,
							pattern: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							pattern: "yyyy"
						}
					}
				},
				granularity: "1day",
				finestGranularity:  "1hour",
				coarsestGranularity:  "1week",
				rate:  1
			});

			*/
		},

		_createTimeAxis1: function() {
			var oTimeAxis = new sap.gantt.config.TimeAxis({
				planHorizon: new sap.gantt.config.TimeHorizon({
					startTime: "20071228000000",
					endTime: "20270101000000"
				}),
				initHorizon: new sap.gantt.config.TimeHorizon({

				}),
				zoomStrategy: {
					"1hour": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							range: 20
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							pattern: "dd.M.yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.hour,
							span: 1,
							pattern: "HH"
						}
					},
					"1day": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							format: "MMM yyyy,'Week' ww"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.day,
							span: 1,
							format: "EEE dd"
						}
					},
					"1week": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							format: "MMMM yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							format: "'CW' w"
						}
					},
					"1month": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							format: "yyyy, QQQ"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							format: "MMM"
						}
					},
					"1quarter": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							format: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 3,
							format: "QQQ"
						}
					},
					"1year": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 10,
							format: "yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.year,
							span: 1,
							format: "yyyy"
						}
					}
				},
				granularity: "1day",
				finestGranularity: "1hour",
				coarsestGranularity: "1week",
				rate: 1
			});

			return oTimeAxis;
		},
		onSelectionChange: function(oEvent) {

			var that = this;
			// add filter for search
			var oGanttChartContainer = that.getView().byId("GanttChartContainer");
			var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
			var aFilters = [];
			var sQuery = oEvent.getSource().getSelectedItem().getText();

			if (sQuery != "All Flights") {

				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}

				// update list binding

				//var list = this.getView().byId("idList");
				var binding = oGanttChartWithTable.getBinding("rows");
				binding.filter(aFilters);
			} else {
				var binding = oGanttChartWithTable.getBinding("rows");
				binding.aFilters = null;
				binding.filter(aFilters);
			}

		},
		onSelectionChangeSort: function(oEvent) {

			var that = this;
			// add filter for search
			var oGanttChartContainer = that.getView().byId("GanttChartContainer");
			var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
			var aFilters = [];
			var aSorters = [];
			var sQuery = oEvent.getSource().getSelectedKey();

			if (sQuery != "00") {

				// update list binding

				//var list = this.getView().byId("idList");
				var binding = oGanttChartWithTable.getBinding("rows");

				var bDescending = true;
				aSorters.push(new Sorter(sQuery, bDescending));
				binding.sort(aSorters);
			} else {
				var binding = oGanttChartWithTable.getBinding("rows");
				binding.aSorters = null;
				binding.sort(aSorters);
			}
			
		},
		
		onChartClick: function(oEvent) {
			var that = this,
				y = window.origin.split("-"),
				z = y[0].split("//"),
				aData = oEvent.mParameters.objectInfo.data;
			
			if (aData.waitingtime != undefined && oEvent.mParameters.timestamp !== NaN) {
				
				var aWaitingtime = aData.waitingtime;
				var clickTime = oEvent.mParameters.timestamp;
				
				for (var i = 0; i < aWaitingtime.length; i++) {
					for (var j = 0; j < aWaitingtime[i].length; j++) {
						if (aWaitingtime[i][j].startTime) {
							if ((clickTime > that.calculateTime(aWaitingtime[i][j].startTime)) 
								&& (clickTime < that.calculateTime(aWaitingtime[i][j].endTime))) {
									
								//Open PTS app
							window.open("https://sap-solution-experience-sdcplatform-prod-pts.cfapps.eu10.hana.ondemand.com/index.html"+ 
							"?flightOne=" + aWaitingtime[i][j].flightno1 + "&flightOneEndTime=" + aWaitingtime[i][j].endTime_pts +
							"&flightTwo=" + aWaitingtime[i][j].flightno2 + "&flightTwoStartTime=" + aWaitingtime[i][j].startTime_pts + "&PTS=" + aWaitingtime[i][j].PTS, "_blank");
							//	window.open(z[0] + "//" + "pts" + "-" + y[1] + "/" + "?flightOne=" + aWaitingtime[i][j].flightno1 + "&flightOneEndTime=" + aWaitingtime[i][j].endTime_pts +
							//		"&flightTwo=" + aWaitingtime[i][j].flightno2 + "&flightTwoStartTime=" + aWaitingtime[i][j].startTime_pts + "&PTS=" + aWaitingtime[i][j].PTS, "_blank");
							}
						}
					}
				}
			}
		},
		
		calculateTime: function(time) {
			var year = time.substr(0, 4);
			var month = time.substr(4, 2);
			var date = time.substr(6, 2);
			var hrs = time.substr(8, 2);
			var min = time.substr(10, 2);
			var sec = time.substr(12, 2);
			return new Date(year + "-" + month + "-" + date + " " + hrs + ":" + min + ":" + sec).getTime();
		},
		
		deviationDialog: null,
		
		onDeviationDialog: function() {
			if (!this.deviationDialog) {
				
				this.deviationDialog = new Dialog({
					//	title: 'Runway Closure Alert',
					showHeader: false,
					type: 'Message',
					contentWidth: "250px",
					contentHeight: "120px",
					draggable: true,
					content: [
						new HTML({
							/*content:"<div class='alertImgContainer'><img class='alertImg' src='media/images/dialog-close.png' onclick='closeDeviationAlert()' /></div><div class='alertBlck'> <div class='alertTitle'> THIK FOG AT THE RUNWAY! <br><br></div><div class='alertTxt1'> Runway 01 will be closed for another<br> 24hrs due to thick fog</div><div class='alertTxt2'> Please use the <br> <a class='alertLink' href='#' onclick='onDeviationLink()'> Deviation Manager </a></div> </div>" */
							content: "<div class='alertImgContainer'><img class='alertImg' src='media/images/dialog-close.png' onclick='closeEIBTDialog()' /></div><div class='alertTxt1'>Single runway closure alert at DXB </div><div class='alertTxt2'> Please use the <br> <a class='alertLink' href='#' onclick='onDeviationLink()'> Deviation Manager </a></div> </div>"
						})
					]
				});

				//to get access to the global model
				this.deviationDialog.addStyleClass("deviationClass");
				this.getView().addDependent(this.deviationDialog);
				aDPopup = this.deviationDialog;
			}

			this.deviationDialog.open();
		},
		//EIBTDialog: null,
		_onEIBTDialog: function() {
			var that = this;

			if (!this.EIBTDialog) {

				this.EIBTDialog = new Dialog({
					showHeader: false,
					type: 'Message',
					contentWidth: "250px",
					contentHeight: "120px",
					draggable: true,
					content: [new HTML({
						content: "<div class='alertImgContainer'><img class='alertImg' src='media/images/dialog-close.png'/></div><div class='eibtAlertTitle'>Delay Alert</div><div class='alertTxt1'>EIBT for 0407 is +30 minutes</div></div>"
					})]
				});
				this.EIBTDialog.addStyleClass("deviationClass");
				this.getView().addDependent(this.EIBTDialog);
				//aEIBTDialog = this.EIBTDialog;
			}

			if (!this.EIBTDialog.isOpen()) {
				this.EIBTDialog.open();
				window.setTimeout(function() {
								//close the popup here
								//	aEIBTDialog.close();
								that.EIBTDialog.close();
							}, 5000);
			}
		},
		_openDeviationLink: function(evt) {

			let aThis = evt.oSource.getParent().getParent().getController();

			let postData = {
				counter: aThis.getView().getModel("counterModel").getData().counter.toString(),
				deviation: "0"
			};
			aThis._updateCounter(postData);
			window.open("http://gerecovery-demo.northeurope.cloudapp.azure.com:4200/", "_blank");
		},
		_updateCounter: function(postData) {
			var sPath = "/destinations/NeoHANA/demo_mvp2/update_counter.xsjs";
			$.ajax({
				url: sPath,
				type: 'POST',
				data: JSON.stringify(postData),
				async: false,
			}).then(function(data, result, type) {
				if (type.status == 200) {
					console.log("Data updated successfully.");
				} else {
					console.log("Error updating data.");
				}
			});
		},

		_getCounter: function() {
			if (!this.lastCount) {
				this.lastCount = 0;
			}
			var sPath = "/destinations/NeoHANA/demo_mvp2/get_counter.xsjs";
			var that = this;
			this._oModel = new JSONModel();
			$.ajax({
				url: sPath,
				type: 'GET',
				async: false,
			}).then(function(data) {
				console.log("Reading counter value from XSJS " + data);
				data = JSON.parse(data);
				that._oModel.setData(data);
				//step 2 for EIBT popup
				
				if (that.lastCount != 2 && data.counter == 2) {
					that._onEIBTDialog();	
				} 
				
				that.lastCount = data.counter;
				
				/**if (data.counter == 2) {
					//open popup

					//set the global model for tracking dialog
					if (!sap.ui.getCore().getModel("EIBTModel")) {
						let aModel = new JSONModel();
						aModel.setData({
							"EIBT": "1"
						});
						sap.ui.getCore().setModel(aModel, "EIBTModel");
						that._onEIBTDialog();
						window.setTimeout(function() {
							//close the popup here
							//	aEIBTDialog.close();
							closeEIBTDialog();
						}, 10000);
					}
				} else {
					if (that.EIBTDialog) {
						that.EIBTDialog.close();
					}
					that.getView().setModel(that._oModel, "counterModel");
					sap.ui.getCore().setModel(that._oModel, "counterModel");
					//that.onDeviationDialog();
					if (parseInt(data.deviation) == 1)
						that.onDeviationDialog();
					else if (that.draggableDialog) {
						that.draggableDialog.close();
						//that.draggableDialog.destroy();
					} else {
						if (aDPopup)
							aDPopup.close();
					}
				}**/

			});

		},
	});
});  
var aDPopup, aEIBTDialog;

function onDeviationLink() {
	let aCoreModel = sap.ui.getCore().getModel("counterModel");
	let postData = {
		counter: aCoreModel.getData().counter.toString(),
		deviation: "0"
	};
	var sPath = "/destinations/NeoHANA/demo_mvp2/update_counter.xsjs";
	$.ajax({
		url: sPath,
		type: 'POST',
		data: JSON.stringify(postData),
		async: false,
	}).then(function(data, result, type) {
		if (type.status == 200) {
			console.log("Data updated successfully.");
		} else {
			console.log("Error updating data.");
		}
	});
	window.open("http://gerecovery-demo.northeurope.cloudapp.azure.com:4200/", "_blank");

}

function closeDeviationAlert() {
	aDPopup.close();
}

function closeEIBTDialog() {
	aEIBTDialog.close();
}

// added by navin for header bar 

	function toList() {
			//this.router.navTo("flight-list");
		//	window.location.href = "https://neomvp-a577bbf7e.dispatcher.hana.ondemand.com/index.html#/flight-list";
				window.location.href = "https://sap-solution-experience-sdcplatform-prod-customerorder.cfapps.eu10.hana.ondemand.com/index.html#/flight-list";
		}
	function toAerial() {
			//this.router.navTo("flight-map");
		//	window.location.href = "https://neomvp-a577bbf7e.dispatcher.hana.ondemand.com/index.html#/flight-aerial";
			window.location.href = "https://sap-solution-experience-sdcplatform-prod-customerorder.cfapps.eu10.hana.ondemand.com/index.html#/flight-aerial";
		}
	function toTurnAround() {
		//	window.location.href = "https://turnaroundview-a577bbf7e.dispatcher.hana.ondemand.com/index.html";	
			window.location.href = "https://sap-solution-experience-sdcplatform-prod-ta.cfapps.eu10.hana.ondemand.com/index.html";	
		}

	
		// header search based on flight
	function onFlightSearch(oEvt){
		 	var aFilters = [],
				sQuery = oEvt.getSource().getValue(),
				aItems = this._oModel.getData().root.children, 
				aNames = [],
				oGanttChartContainer =  this.getView().byId("GanttChartContainer"),
				binding = oGanttChartContainer.getGanttCharts()[0].getBinding("rows");
				
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			
			//Search for flight number & stand
			for (var i = 0; i < aItems.length; i++) {
				var bIncluded = false,
					str = "",
					aFlightDetails = aItems[i].flightfromtodetails; 
				
				for (var j = 0; j < aFlightDetails.length; j++) {
					str = aFlightDetails[j].text;					
					if (sQuery && str !== undefined && str.includes(sQuery)) {
						aNames.push(aItems[i].name);
						break; 
					} 
				} 
			} 
			
			for (var k = 0; k < aNames.length; k++) {
				aFilters.push(new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, aNames[k])); 
			} 
			
			// update list binding
			binding.filter(aFilters, "Application");
	}	
		
	function onRemoteSetting(oEvent) {
		//	alert("hi");
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("TurnAroundView.view.remote", this);
			this.getView().addDependent(this._oPopover);
		}
	
		this._oPopover.openBy(oEvent.getSource());
	}
// added by navin for header bar