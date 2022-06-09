sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"sap/ui/model/json/JSONModel",
			"sap/ui/model/Filter"
		], function(Controller, JSONModel, Filter) {
			"use strict";
			return Controller.extend("ULD.controller.BaggageTracker", {
						onInit: function() {
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
								const uriSources = ['headerModel', 'journey'];

								uriSources.map(alias => {
											this._loadData(
													`${this.getOwnerComponent().getManifestEntry(`/sap.app/dataSources/${alias}/uri`)}?${this.query}`, alias);
			});

			// Filter table to all bags at risk with initial load
			this.filterBagsAtRisk();

			// Set model for flight detail header - updates fields on flight select
			const flightDetailHeader = new JSONModel({
				"flight": "",
				"origin": "",
				"conn": ""
			});

			const progressBar = new JSONModel({
				"xi": 5,
				"xd": 5
			});

			this.byId("progressBar").addEventDelegate({
				onAfterRendering: function () {
					this._updateProgress();
				}
			}, this);

			$(window).resize(function () {
				//do something, window hasn't changed size in 500ms
				const interval = 100;
				setTimeout(() => this._updateProgress(), interval);
			}.bind(this));

			this.getView().setModel(flightDetailHeader, "flightDetailHeader");
			this.getView().setModel(progressBar, "progressBar");
		},

		_updateProgress: function () {
			let btn1, btn2;
			const bar = document.getElementById("__xmlview0--progressBar-__xmlview0--flightSourceTbl-0").getBoundingClientRect();
			
			if (document.getElementById("__step10-__xmlview0--flightSourceTbl-0-inner")) {
				btn1 = document.getElementById("__step10-__xmlview0--flightSourceTbl-0-inner").getBoundingClientRect();
				btn2 = document.getElementById("__step11-__xmlview0--flightSourceTbl-0-inner").getBoundingClientRect();
			} else {
				btn1 = document.getElementById("__step14-__xmlview0--flightSourceTbl-1-inner").getBoundingClientRect();
				btn2 = document.getElementById("__step15-__xmlview0--flightSourceTbl-1-inner").getBoundingClientRect();
			}

			const xi = btn1.x + (btn1.width / 2) - bar.x;
			const xd = btn2.x - btn1.x;

			const xiPercent = (xi / bar.width) * 100;
			const xdPercent = (xd / bar.width) * 100;

			this.getView().getModel("progressBar").setData({
				"xi": xiPercent,
				"xd": xdPercent
			});
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

		onULD: function (evt) {
			const that = this;
			const uldfragment = sap.ui.xmlfragment("ULD.view.Fragments.uld", this);
			const uldDialog = new sap.m.Dialog({
				content: uldfragment,
				showHeader: false,
				subHeader: new sap.m.Bar({
					contentRight: new sap.m.Button("dialogButton", {
						text: "",
						icon: "sap-icon://decline",
						press: function () {
							uldDialog.close();
							uldDialog.destroy();
						}
					})
				}),
				title: "",
				contentWidth: "850px",
				contentHeight: "80%"
			});
			
			this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/uld/uri")}`, "uld");
				
			uldDialog.open();
			uldDialog.setModel(that.getView().getModel("headerModel"), "headerModel");
			uldDialog.setModel(that.getView().getModel("uld"));
		},

		onSearchFlights: function (oEvent) {
			const filter = new Filter("flight", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("newValue"));
			const oBinding = this.byId("flightSourceTbl").getBinding("items");
			oBinding.filter(filter);
		},

		filterBagsAtRisk: function (oEvent) {
			const steps = ['inb_bay', 'out_bay', 'bhs', 'inb_enroute', 'out_enroute', 'landed', 'out_loaded', 'out_mup', 'out_reconcile',
				'inb_transfer'
			];
			const aFilters = steps.map(f => new Filter(f, sap.ui.model.FilterOperator.LT, 0));
			const filter = new Filter({
				filters: aFilters,
				and: false
			});
			const oBinding = this.byId("flightSourceTbl").getBinding("items");
			oBinding.filter(filter);
		},

		filterAllBags: function (oEvent) {
			const oBinding = this.byId("flightSourceTbl").getBinding("items");
			oBinding.aFilters = [];
			this.byId("flightSourceTbl").getModel("journey").refresh(true);
		},

		onFlightSelect: function (oEvent) {
			const oHeaderDetails = this.getView().getModel("headerModel").getData().header;
			const oFlightData = this.byId("flightSourceTbl").getSelectedItem().getBindingContext("journey").getObject();

			this.getView().getModel("flightDetailHeader").setData({
				"flight": oFlightData.flight,
				"conn": oFlightData.conn,
				"origin": oFlightData.origin
			});

			this._loadData(`${this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/flightDetails/uri")}?${this.query}&connecting=${oFlightData.flight}`, "flightDetails");

			this.byId("flightDetailTbl").getLayoutData().setSize("60%");
		}

	});
});