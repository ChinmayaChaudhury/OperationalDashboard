sap.ui.define(
	["sap/ui/core/Control"],
	function(Control) {
		return Control.extend("custom-control.OrderCard", {
			metadata: {
				properties: {
					name: {
						type: "string",
						defaultValue: "N/A"
					},
					subtext: {
						type: "string",
						defaultValue: ""
					},
					start: {
						type: "string",
						defaultValue: ""
					},
					end: {
						type: "string",
						defaultValue: ""
					},
					status: {
						type: "string",
						defaultValue: "green"
					},
					type: {
						type: "string",
						defaultValue: ""
					},
					providerLogo: {
						type: "string",
						defaultValue: ""
					},
				},
				aggregations: {
					providerDetails: {
						type: "custom-control.OrderDetails",
						multiple: true
					}
				},
				events: {}
			},
			init: function() {
				// 
			},
			renderer: function(oRm, oControl) {
				oRm.write("<li");
				oRm.writeControlData(oControl);
				oRm.addClass("card");

				if (oControl.getProviderDetails().length) {
					oRm.addClass("expand");
				}

				oRm.writeClasses();
				oRm.write(">");
				oRm.write("<header");
				oRm.writeAttribute("data-status", oControl.getStatus());
				oRm.write(">");
				oRm.write("<img");

				let icon = "./appResources/asset/media/icons/";

				switch (oControl.getType().toLowerCase()) {
					case "flight":
						icon += "flight.svg"
						break;
					case "hotel":
						icon += "hotel.png"
						break;
					case "taxi":
						icon += "taxi.svg"
						break;
					case "activity":
						icon += "sports.svg"
						break;
				}

				oRm.writeAttribute("src", icon);
				oRm.writeAttribute("alt", oControl.getType().toLowerCase());
				oRm.addClass("icon");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("<h1");
				oRm.addClass("name");
				oRm.writeClasses();
				oRm.write(`>${oControl.getName()}</h1>`);
				oRm.write("<h2");
				oRm.addClass("subtext");
				oRm.writeClasses();
				oRm.write(`>${oControl.getSubtext()}</h2>`);
				oRm.write("<time");
				oRm.addClass("start");
				oRm.writeClasses();
				oRm.write(`>${oControl.getStart()}</time>`);

				if (oControl.getEnd()) {
					oRm.write("<time");
					oRm.addClass("end");
					oRm.writeClasses();
					oRm.write(`>${oControl.getEnd()}</time>`);
				}

				oRm.write("</header>");
				oRm.write("<main>");
				oRm.write("<ul");
				oRm.addClass("participants");
				oRm.write(">");
				oRm.write("</ul>");

				if (oControl.getProviderDetails().length) {
					oRm.write("<section");
					oRm.addClass("partner");
					oRm.writeClasses();
					oRm.write(">");
					oRm.write("<main>");
					oRm.write("<img");
					oRm.writeAttribute("src", `${oControl.getProviderLogo()}`);
					oRm.addClass("partner-logo");
					oRm.writeClasses();
					oRm.write("><section");
					oRm.addClass("details");
					oRm.writeClasses();
					oRm.write(">");

					for (let [key, value] of Object.entries(oControl.getProviderDetails())) {
						oRm.renderControl(value);
					};
					
					
					oRm.write("</section>");
				}

				oRm.write("</main>");

				if (oControl.getProviderDetails().length) {
					oRm.write("<footer>");
					oRm.write("<a");
					oRm.writeAttribute("role", "button");
					oRm.write(">E-Mail</a>");
					oRm.write("<a");
					oRm.writeAttribute("role", "button");
					oRm.write(">Call</a>");
					oRm.write("</footer>");
				}

				oRm.write("</section>");
				oRm.write("</main>");
				oRm.write("<nav></nav>");
				oRm.write("</li>");
			},
			onAfterRendering: function(args) {
				// if I need to do any post render actions, it will happen here
				if (sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this, args); //run the super class's method first
				}

				this.$().find("main").hide();

				this.$().find("nav").click(function() {
					const card = $(this).parents(".card");

					if (card.hasClass("collapse")) {
						card.removeClass("collapse").addClass("expand");
						card.find("main").slideUp();
					} else {
						card.removeClass("expand").addClass("collapse");
						card.find("main").slideDown();
					}
				});
			}

		});
	}
);