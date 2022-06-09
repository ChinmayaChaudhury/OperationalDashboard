sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/ws/WebSocket"
], function(UIComponent, WebSocket) {
	"use strict";

	return UIComponent.extend("com.emirates.neo.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			// this.setModel(models.createDeviceModel(), "device");

			// Initilize router
			this.getRouter().initialize();

			// This is to synchronize model updates between different models.
			this.orchestrateDataSync(sap.ui.getCore().getEventBus());

			sap.ui.core.IconPool.addIcon("outboundFlight", "ek", "icomoon", "e917");
			sap.ui.core.IconPool.addIcon("inboundFlight", "ek", "icomoon", "e918");
			sap.ui.core.IconPool.addIcon("notArrived", "ek", "icomoon", "e919");
			sap.ui.core.IconPool.addIcon("notAtGate", "ek", "icomoon", "e91c");
			sap.ui.core.IconPool.addIcon("boarded", "ek", "icomoon", "e921");
			sap.ui.core.IconPool.addIcon("atGate", "ek", "icomoon", "e922");
			sap.ui.core.IconPool.addIcon("passport", "ek", "icomoon", "e923");
			sap.ui.core.IconPool.addIcon("checkedIn", "ek", "icomoon", "e924");
			sap.ui.core.IconPool.addIcon("totalPax", "ek", "icomoon", "e925");

		},
		/**
		 * Helps coordinate/synchornize data reloads of data models
		 *
		 * @param {sap.ui.core.EventBus} eventBus - Component event bus that allows firing, attaching and detaching events
		 * @return {void}
		 * @description The methods helps orchestrate disparate models that consume separate service
		 * end-points to refresh the data whenever backend data is updated. This is done by propogating
		 * a message to all subscribers whenever we receive a message via our web socket connection. The subscribers
		 * are all of those data models that are bound to UI controls. This replaces the need to poll data at set intervals
		 * which helps reduce the number of unnecessary requests to the API layer.
		 */
		orchestrateDataSync: (eventBus) => {
			// SAP ESP security token
			const securityToken = "bmUwMjpXZWxjb21lMTIz";

			// SAP ESP publisher/stream details 
			const espDetails = {
				workspace: "lab4",
				project: "hana_ws_pts",
				streams: ["pts_change"]
			};

			// Tail number
			const tail = jQuery.sap.getUriParameters().get("tail");

			const webSocket = new WebSocket(`/websocket/notifier`);

			// When the connection is opened ...
			webSocket.attachOpen(null, () => {
				const subscriptionReq = {
					"version": 1,
					"action": "subscribe",
					"streams": espDetails.streams
				};

				webSocket.send(JSON.stringify(subscriptionReq));
			});

			// When a message is received
			webSocket.attachMessage(null, () => {
				// Publish event
				eventBus.publish(tail, "dataUpdate", null);
			});
		}
	});
});