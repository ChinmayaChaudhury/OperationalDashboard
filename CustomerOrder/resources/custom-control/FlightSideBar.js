sap.ui.define(["sap/ui/core/Control"], function (Control) {
	"use strict";
	return Control.extend("custom-control.FlightSideBar", {
		"metadata": {
			"properties": {
				flight: {
					type: "string",
					defaultValue: ""
				},
				direction: {
					type: "string",
					defaultValue: "arriving"
				},
				status: {
					type: "string",
					defaultValue: "green"
				},
				origin: {
					type: "string",
					defaultValue: ""
				},
				destination: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				timings: {
					type: "custom-control.InfoBox",
					multiple: true
				},
				activities: {
					type: "custom-control.FlightActivity",
					multiple: true

				},
				links: {
					type: "sap.m.Link",
					multiple: true
				}
			},
			"events": {}
		},
		init: function () { },
		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("side-panel");
			oRm.writeClasses();
			oRm.writeAttribute("data-icon", oControl.getDirection());
			oRm.write(">");
			oRm.write("<section");
			oRm.writeAttribute("data-status", oControl.getStatus());
			oRm.writeAttribute("role", "button");
			oRm.write(">");
			oRm.write("<h1");
			oRm.addClass("flight-number");
			oRm.writeClasses();
			oRm.write(`>${oControl.getFlight()}</h1>`);
			oRm.write("<div");
			oRm.addClass("flight-route");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(`<h2>${oControl.getOrigin()}</h2>`);
			oRm.write(`<h2>${oControl.getDestination()}</h2>`);
			oRm.write("</div>");
			oRm.write("</section>");

			// Mid-section
			oRm.write("<section>");

			for (let [key, value] of Object.entries(oControl.getTimings())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");

			// Last section
			oRm.write("<section");
			oRm.addClass("last");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<section");
			oRm.addClass("actions");
			oRm.writeClasses();
			oRm.write(">");

			// Activities
			for (let [key, value] of Object.entries(oControl.getActivities())) {
				oRm.write("<h1");
				oRm.writeAttribute("data-status", value.getStatus());
				oRm.writeAttribute("role", "button");
				oRm.writeAttribute("data-key", value.getKey());
				oRm.writeAttribute("title", value.getTitle());
				//oRm.write(`>${value.getKey()}</h1>`);
				oRm.write(`>${value.getKey().replace(/\d+/g, '')}</h1>`);
			}

			// Links
			for (let [key, value] of Object.entries(oControl.getLinks())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");

			// Activity Slider
			oRm.write("<section");
			oRm.addClass("slider");
			oRm.writeClasses();
			oRm.write(">");

			for (let [key, value] of Object.entries(oControl.getActivities())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");
			oRm.write("</section>");
			oRm.write("</div>");
		},
		onAfterRendering: function (evt) {
			const animation = { duration: 350 };

			$(".side-panel .actions [data-key]").each((key, value) => {
				const activity = $(value).attr("data-key");

				$(value).click(() => {
					const slider = $(value).parents(".side-panel").find(`.slider`);
					const infobar = $(slider).find(`[data-key=${activity}]`);
					const others = $(infobar).siblings();

					// Slide-in animation
					$(others).animate({ opacity: 0 }, { duration: animation.duration, queue: false }).slideUp();

					// Slide-out animation
					$(infobar).animate({ opacity: 1 }, { duration: animation.duration, queue: false }).slideDown().css({ display: "grid", float: "none" });

					$(infobar).find(".slider-heading").click(() => {
						// Slide-in animation
						$(infobar).animate({ opacity: 0 }, { duration: animation.duration, queue: false }).slideUp();
					});
				});

			});
		}
	});
});