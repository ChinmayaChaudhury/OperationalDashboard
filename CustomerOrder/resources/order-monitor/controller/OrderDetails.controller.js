sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"libs/moment",
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("order-monitor.controller.OrderDetails", {
		onInit: function() {
			this.parameters = {
				flight: jQuery.sap.getUriParameters().get("flight"),
				date: jQuery.sap.getUriParameters().get("date"),
				time: jQuery.sap.getUriParameters().get("time"),
				tail: jQuery.sap.getUriParameters().get("tail")
			};

			const router = sap.ui.core.UIComponent.getRouterFor(this);

			router.getRoute("order-details").attachPatternMatched(function(evt) {
				/** 
				 * @property {Number} _busyModels=0 - Number of models that are still not complete (e.g. > 0 models are still loading data).
				 * @private
				 * */
				this._busyModels = 0;

				//for local datsource url, pass the flag as true
				this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/order-list/uri")}?order=${evt.mParameters.arguments.order}`, "summary");
				this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/order-details/uri")}?order=${evt.mParameters.arguments.order}`, "details");
			}, this);
		},

		onAfterRendering: function() {},

		/**
		 * Renders the map container element (where OSMBuildings canvas element is to be embedded) and injects it
		 * into the DOM along with control data & classes.
		 * @memberof PAX.controller.PassengerTracker#
		 * @param {string} uri - URI of service end-point.
		 * @param {string} modelAlias - 
		 * @param {string} [subscribe=true] - The data model subscribes to the EventBus.
		 * @return {void}
		 */
		_loadData: function(uri, modelAlias, subscribe = true) {
			const aModel = new JSONModel();

			// Initial load of data
			aModel.loadData(uri, null, true, "GET");

			if (subscribe) {
				// Subscribe to data update events
				const eventBus = sap.ui.getCore().getEventBus();

				eventBus.subscribe(this.parameters.tail, "dataUpdate", () => aModel.loadData(uri, null, true, "GET"));
			}

			// Show busy indicator dialog
			// this.byId("BusyDialog").open();
			this._busyModels++;

			// Keep track of number of busy models to close the busy indicator dialog once all data is loaded
			if (this._busyModels) {
				aModel.attachRequestCompleted(() => {
					if (this._busyModels > 0) {
						this._busyModels--;
					} else {
						this._busyModels = 0;
					}

					// if (!this._busyModels) {
					// 	this.byId("BusyDialog").close();
					// }
				}, this);
			}

			// Assign models to view
			this.getView().setModel(aModel, modelAlias);
		}
	});
});