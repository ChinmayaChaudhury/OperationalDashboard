/**
 * PAX view controller.
 * @module PAX/controller/PassengerTracker
 * @requires sap.ui.core.mvc.Controller
 * @requires sap.ui.model.json.JSONModel
 * @requires sap.ui.core.ws.WebSocket
 * @requires sap.ui.model.Filter
 * @see PAX.controller.PassengerTracker
 */
sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"sap/ui/model/json/JSONModel",
			"sap/ui/core/ws/WebSocket",
			"sap/ui/model/Filter",
			"PAX/control/map/libs/Tween"
		], function(Controller, JSONModel, WebSocket, Filter, Tween) {
			"use strict";
			/**
			 * Creates a new instance of OSMBuildings map.
			 * @class PAX.controller.PassengerTracker
			 * @extends {sap.ui.core.mvc.Controller}
			 * @since MVP3
			 */
			return Controller.extend("PAX.controller.PassengerTracker",
					/** @lends PAX.controller.PassengerTracker# */
					{
						/**
						 * Initializes OSMBuildings object.
						 * @this PAX.controller.PassengerTracker
						 * @return {void}
						 */
						onAfterRendering: function() {
								this.parameters = {
									flight: jQuery.sap.getUriParameters().get("flight"),
									date: jQuery.sap.getUriParameters().get("date"),
									time: jQuery.sap.getUriParameters().get("time"),
									tail: jQuery.sap.getUriParameters().get("tail")
								};

								this.query = `flight=${this.parameters.flight}&date=${this.parameters.date}&time=${this.parameters.time}`;

								/** 
								 * @property {Number} _busyModels=0 - Number of models that are still not complete (e.g. > 0 models are still loading data).
								 * @private
								 * */
								this._busyModels = 0;

								//for local datsource url, pass the flag as true
								const uriSources = ['header', 'journey', 'flights'];

								uriSources.map(alias => {
											this._loadData(
													`${this.getOwnerComponent().getManifestEntry(`/sap.app/dataSources/${alias}/uri`)}?${this.query}`, alias);
				});

				const oViewModel = new JSONModel({
					"airport": true
				});
				this.getView().setModel(oViewModel, "view");

				const oLocations = new JSONModel("./model/locations.json");
				this.getView().setModel(oLocations, "locations");

				this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources").flightsDetails.uri}`, "pax");

				// Map location data
				const securityToken = "bmUwMjpXZWxjb21lMTIz";
				const espDetails = {
					workspace: "lab4",
					project: "hana_ws_pax",
					streams: ["pax_change"]
				};

				const webSocket = new WebSocket(`/websocket/map`);

				// When the connection is opened
				webSocket.attachOpen(null, () => {
					const subscriptionReq = {
						"version": 1,
						"action": "subscribe",
						"streams": espDetails.streams
					};

					webSocket.send(JSON.stringify(subscriptionReq));
				});

				// When a message is received
				const self = this;

				webSocket.attachMessage(null, function (message) {
					// TODO: call addPin() of Map.js
					// this.byId('indoorMap').g
					const data = JSON.parse(message.getParameter("data")).data;
					data.map(location => {
						console.log(location);
						self.byId("indoorMap").addPin(
							location[1],
							location[2],
							location[3],
							location[4]
						);
					});
				}, this);
			},

			/**
			 * Renders the map container element (where OSMBuildings canvas element is to be embedded) and injects it
			 * into the DOM along with control data & classes.
			 * @memberof PAX.controller.PassengerTracker#
			 * @param {string} uri - URI of service end-point.
			 * @param {string} modelAlias - 
			 * @param {string} [subscribe=true] - The data model subscribes to the EventBus.
			 * @return {void}
			 */
			_loadData: function (uri, modelAlias, subscribe = true) {
				const aModel = new JSONModel();

				// Initial load of data
				aModel.loadData(uri, null, true, "GET");

				if (subscribe) {
					// Subscribe to data update events
					const eventBus = sap.ui.getCore().getEventBus();

					eventBus.subscribe(this.parameters.tail, "dataUpdate", () => aModel.loadData(uri, null, true, "GET"));
				}

				// Show busy indicator dialog
				this.byId("BusyDialog").open();
				this._busyModels++;

				// Keep track of number of busy models to close the busy indicator dialog once all data is loaded
				if (this._busyModels) {
					aModel.attachRequestCompleted(() => {
						if (this._busyModels > 0) {
							this._busyModels--;
						} else {
							this._busyModels = 0;
						}

						if (!this._busyModels) {
							this.byId("BusyDialog").close();
						}
					}, this);
				}

				// Assign models to view
				this.getView().setModel(aModel, modelAlias);
			},
			
			/**
			 * Event handler for the passenger filter field
			 * @memberof PAX.controller.PassengerTracker#
			 * @param {object} oEvent - Fired event with source info and data.
			 * @return {void}
			 */
			_onFilterPassengers: function (oEvent) {
				const oViewModel = this.getView().getModel("view");
				oViewModel.setProperty("/airport", oEvent.getSource().getSelectedKey() == "airport" ? true : false);

				if (oEvent.getSource().getSelectedKey() != "airport" && this.byId("flightSourceTbl").getSelectedItem() == null) {
					this.byId("flightSourceTbl").setSelectedItem(this.byId("flightSourceTbl").getItems()[0]);
					const oFlightData = this.byId("flightSourceTbl").getItems()[0].getBindingContext("flights").getObject();
					this._onShowFlightDetails(oFlightData, "flightdetail");
				}
			},
			
			/**
			 * Event handler for displaying flight details
			 * @memberof PAX.controller.PassengerTracker#
			 * @private
			 * @param {object} oFlightData - 
			 * @param {string} sAlias - Model alias
			 * @return {void}
			 */
			_onShowFlightDetails: function (oFlightData, sAlias) {
				this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources").flightsDetails.uri}?${this.query}&connecting=${oFlightData.flight}`, sAlias);
			},
			
			/**
			 * Event handler for displaying flight details
			 * @memberof PAX.controller.PassengerTracker#
			 * @param {object} oEvent - Fired event with source info and data.
			 * @return {void}
			 */
			_onSelectFlight: function (oEvent) {
				const sPath = oEvent.getParameter("listItem").getBindingContextPath();
				const oFlightData = this.getView().getModel("flights").getObject(sPath);

				this._onShowFlightDetails(oFlightData, "flightdetail");
			},
			
			/**
			 * Event handler for flights filter
			 * @memberof PAX.controller.PassengerTracker#
			 * @param {object} oEvent - Fired event with source info and data.
			 * @return {void}
			 */
			_onSearchFlights: function (oEvent) {
				const filter = new Filter("flight", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("newValue"));
				const oBinding = this.byId("flightSourceTbl").getBinding("items");
				
				oBinding.filter(filter);
			},
			
			/**
			 * Event handler for menu action (i.e. when the menu is pressed)
			 * @memberof PAX.controller.PassengerTracker#
			 * @param {object} oEvent - Fired event with source info and data.
			 * @return {void}
			 */
			_onMapMenuAction: function (oEvent) {
				this.byId("mainMapMenu").setText(oEvent.getParameter("item").getParent().getText() + " - " + oEvent.getParameter("item").getText());
				const mapControl = this.byId("mapHolder").getItems()[1];
				mapControl.loadLevel(oEvent.getParameter("item").getKey(), mapControl);
			}

		});
});