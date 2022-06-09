sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ws/WebSocket",
	"sap/m/MessageToast"
], function (Controller, JSONModel, WebSocket, MessageToast) {
	"use strict";
	var webSocket;

	return Controller.extend("com.ek.neo.DemoNav.controller.View1", {
		onInit: function () {
			var self = this;

			this.initiateWebSocket();
			/*
			const webSocket = new WebSocket(`/websocket/stepper`);

			// When the connection is opened
			webSocket.attachOpen(null, () => {

			});

			webSocket.attachMessage(null, function (message) {
				const model = new JSONModel();

				model.setData(JSON.parse(message.getParameter("data")));

				model.attachPropertyChange(evt => {
					const dataObj = evt.getSource().getData();

					webSocket.send(JSON.stringify(dataObj));

					MessageToast.show("Data updated successfully.");
				});

				self.getView().setModel(model, "EK");
			}, this);
			*/
		},
		onReset: function () {
			var model = this.getView().getModel("EK");

			// The API is expecting a string!
			model.setProperty("/step", "1", null, true);
			model.firePropertyChange();
		},
		stepChange: function(evt)
		{
		var selectedStep = evt.getSource().getSelectedKey();
		 if((!webSocket) || (webSocket.getReadyState() == 3))
			{
				this.initiateWebSocket();
			}
			var model = this.getView().getModel("EK");

			// The API is expecting a string!
			model.setProperty("/step", selectedStep, null, true);
			model.firePropertyChange();
		},
		initiateWebSocket: function(){
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
		}
	});
});