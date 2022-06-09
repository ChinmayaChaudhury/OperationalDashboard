sap.ui.define(
	[
		"sap/ui/core/Control",
		"libs/moment"
	],
	function (Control) {
		return Control.extend("custom-control.OrderDay", {
			metadata: {
				properties: {
					day: {
						type: "string",
						defaultValue: "N/A"
					},
					today: {
						type: "string",
						defaultValue: "03/14/2018"
					}
				},
				aggregations: {
					cards: {
						type: "custom-control.OrderCard",
						multiple: true
					}
				},
				events: {}
			},
			init: function () {
				// 
			},
			renderer: function (oRm, oControl) {
				oRm.write("<li");
				oRm.writeControlData(oControl);
				oRm.addClass("day");

				if (moment(oControl.getDay()).isBefore(moment(oControl.getToday()), 'day')) {
					oRm.addClass("past");
				} else if (moment(oControl.getDay()).isSame(moment(oControl.getToday()), 'day')) {
					oRm.addClass("today");
				}

				oRm.writeClasses();
				oRm.write(">");
				oRm.write("<h1");
				oRm.writeAttribute("role", "header");
				oRm.write(`>${oControl.getDay()}</h1>`);
				oRm.write("<ul");
				oRm.writeAttribute("role", "entries");
				oRm.write(">");

				for (let [key, value] of Object.entries(oControl.getCards())) {
					oRm.renderControl(value);
				};

				oRm.write("</ul>");
				oRm.write("</li>");
			},
			onAfterRendering: function (args) {
				// if I need to do any post render actions, it will happen here
				if (sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this, args); //run the super class's method first
				}
			}

		});
	}
);