sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("TurnAroundView.controller.header.FlightOpsHeader", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf EmiratesNEO.view.view.App
		 */
			onInit: function() {
				this.router = sap.ui.core.UIComponent.getRouterFor(this);
			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf EmiratesNEO.view.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf EmiratesNEO.view.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf EmiratesNEO.view.view.App
		 */
		//	onExit: function() {
		//
		//	}
		
		toList: function() {
			//this.router.navTo("flight-list");
		//	window.location.href = "https://neomvp-a577bbf7e.dispatcher.hana.ondemand.com/index.html#/flight-list";
			window.location.href = "https://sap-solution-experience-sdcplatform-prod-customerorder.cfapps.eu10.hana.ondemand.com/index.html#/flight-list";
		},
		toAerial: function() {
			//this.router.navTo("flight-map");
			//window.location.href = "https://neomvp-a577bbf7e.dispatcher.hana.ondemand.com/index.html#/flight-aerial";
			window.location.href = "https://sap-solution-experience-sdcplatform-prod-customerorder.cfapps.eu10.hana.ondemand.com/index.html#/flight-aerial";
		},
		toTurnAround: function() {
			//window.location.href = "https://turnaroundview-a577bbf7e.dispatcher.hana.ondemand.com/index.html";
				window.location.href = "https://sap-solution-experience-sdcplatform-prod-ta.cfapps.eu10.hana.ondemand.com/index.html";	
		}
		
	});

});