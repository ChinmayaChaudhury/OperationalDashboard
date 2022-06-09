sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"libs/moment"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("hub-monitor.controller.FlightList", {
		onInit: function() {
		//	this.uriFlights = "/destinations/NeoHANA/Read_hub_data/read_hublist_aerial.xsjs";
		this.uriFlights = "/api/hub/list";
			this.uriConnections = "./appResources/local-service/quick-connections.json";
			
			this.flightsModel = new JSONModel();
			this.connectionsModel = new JSONModel(this.uriConnections);
			
			
			this.flightsModel.loadData(this.uri, null, true, "GET");

			this.flightsModel.attachRequestCompleted(function(){
				this._updateModel(this.flightsModel);
			}, this);
			
			// Assign models to view
			this.getView().setModel(this.flightsModel);
			this.getView().setModel(this.connectionsModel, "connections");
			
			// Get router
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		onAfterRendering: function() {
			const that = this;
			
			//that.flightsModel.loadData(that.uriFlights, null, true);
			//this._updateModel(that.flightsModel);

			setInterval(() => {
				that.flightsModel.loadData(that.uriFlights, null, true);
				//that.flightsModel.setData(that.uriFlights);
				
				this._updateModel(that.flightsModel);
			}, 1000);
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
		
		toPTS: function(evt) {
			const flightData = evt.getSource().getBindingContext().getProperty();
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
		
		toOrders: function(){
			this.router.navTo("order-list");
		},
		
		showDetails: function(oEvent){
			/*MVP 3*/
			var sKey = oEvent.getSource().getKey();
			const flightData = oEvent.getSource().getParent().getBindingContext().getProperty();
			
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
		},
		
		onCloseDialog: function(evt){
				this._oPAXDialog.close();
		},
		
		toInbound: function (oEvent) {
			var oDialog = sap.ui.getCore().byId("paxDialog");
			oDialog.setContentWidth("500px");
			
			var oNavCon = sap.ui.getCore().byId("navCon");
			var oInbound = sap.ui.getCore().byId("inbound");
			oNavCon.to(oInbound);
		},
		
		onBack: function (oEvent) {
			var oDialog = sap.ui.getCore().byId("paxDialog");
			oDialog.setContentWidth("400px");
			
			var oNavCon = sap.ui.getCore().byId("navCon");
			oNavCon.back();
		}

	});
});