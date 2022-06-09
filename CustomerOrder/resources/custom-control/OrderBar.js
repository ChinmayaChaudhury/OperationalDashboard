sap.ui.define(
	["sap/m/CustomListItem"],
	function(CustomListItem) {
		return CustomListItem.extend("custom-control.OrderBar", {
			metadata: {
				properties: {
					number: {
						type: "string",
						defaultValue: "N/A"
					},
					status: {
						type: "string",
						defaultValue: "green"
					},
					customer: {
						type: "string",
						defaultValue: "N/A"
					},
					score: {
						type: "string",
						defaultValue: "0"
					}
				},
				aggregations: {
					items: {
						type: "custom-control.InfoBox",
						multiple: true
					}
				},
				events: {
					press: {
						parameters: {
							value: {
								type: "string"
							}
						}
					}
				}
			},
			init: function() {
				// 
			},
			renderer: function(oRm, oControl) {
				oRm.write("<li");
				oRm.writeControlData(oControl);
				oRm.addClass("list-item");
				oRm.writeClasses();
				oRm.write(">");

				// Render left content
				oRm.write("<section");
				oRm.writeAttribute("data-status", oControl.getStatus());
				oRm.writeAttribute("role", "button");
				oRm.write(">");
				oRm.write("<h1");
				oRm.addClass("order-number");
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oControl.getNumber());
				oRm.write("</h1>");
				oRm.write("<h2");
				oRm.addClass("customer-name");
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oControl.getCustomer());
				oRm.write("</h2>");
				oRm.write("<h2");
				oRm.writeAttribute("data-badge-value", oControl.getScore());
				oRm.write(">");
				oRm.write("</h2>");
				oRm.write("</section>");

				// Render middle content
				oRm.write("<section>");

				for (let [key, value] of Object.entries(oControl.getItems())) {
					oRm.renderControl(value);
				}

				oRm.write("</section>");
				oRm.write("</li>");
			},
			onAfterRendering: function(args) {
				// if I need to do any post render actions, it will happen here
				if (sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this, args); //run the super class's method first
				}

				// $(".list-item > section:nth-child(2) > div")

			},
			onclick: function(evt) { 
				this.firePress(evt);
			}
		});
	}
);