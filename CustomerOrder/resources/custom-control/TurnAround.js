sap.ui.define(["sap/m/CustomListItem"], function (CustomListItem) {
	"use strict";
	return CustomListItem.extend("EmiratesNEO.control.TurnAround", {
		"metadata": {
			"properties": {
			},
			aggregations: {
				arriving: {
					type: "EmiratesNEO.control.FlightBar",
					multiple: false
				},
				departing: {
					type: "EmiratesNEO.control.FlightBar"

				}
			},
			"events": {}
		},
		init: function () { },
		renderer: function (oRm, oControl) {
			$(oControl.getArriving()).each(function (key, value) {
				oRm.renderControl(value);
			});

			$(oControl.getDeparting()).each(function (key, value) {
				oRm.renderControl(value);
			});
		},
		onAfterRendering: function (evt) { }
	});
});