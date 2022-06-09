sap.ui.define(["sap/m/CustomListItem"], function (Control) {
	"use strict";
	return Control.extend("custom-control.FlightInfoBar", {
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
			oRm.write("<li");
			oRm.writeControlData(oControl);
			oRm.addClass("list-item");
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
			oRm.write("<section>");

			// Mid-section
			oRm.write("<section>");

			for (let [key, value] of Object.entries(oControl.getTimings())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");

			// Sliders
			oRm.write("<section");
			oRm.addClass("slider");
			oRm.writeClasses();
			oRm.write(">");

			// Activity Slider
			for (let [key, value] of Object.entries(oControl.getActivities())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");
			oRm.write("</section>");


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
				oRm.write(`>${value.getKey().replace(/\d+/g, '')}</h1>`);
			}

			// Links
			for (let [key, value] of Object.entries(oControl.getLinks())) {
				oRm.renderControl(value);
			}

			oRm.write("</section>");
			oRm.write("</li>");
		},
		onAfterRendering: function (evt) {
			const animation = { duration: 350 };

			$(".list-item .actions [data-key]").each((key, value) => {
				const activity = $(value).attr("data-key");

				$(value).click(() => {
					const slider = $(value).parents(".list-item").find(`.slider`);
					const infobar = $(slider).find(`[data-key=${activity}]`).css({ display: "flex" });
					const others = $(infobar).siblings();
	
					// Slide-in animation
					$(others).animate({ opacity: 0 }, { duration: animation.duration, queue: false }).css({ display: "none" });

					// Calculate slider width
					const position1 = $(".list-item > section:nth-child(2) > section:first-child > div:nth-child(1)").offset().left;
					const position2 = $(".list-item > section:nth-child(2) > section:first-child > div:nth-child(7)").offset().left;
					const width = position2 - position1 + 25;


					// Slide-out animation
					$(infobar).animate({ opacity: 1 }, { duration: animation.duration, queue: false });
					slider.animate({ width: `${width}px` }, { duration: animation.duration, queue: false });

					$(infobar).find(".slider-heading").click(() => {
						// Slide-in animation
						$(infobar)
							.animate({ opacity: 0 }, { duration: animation.duration, queue: true })
							.queue(function () {
								// This is to make sure that the linked sliders don't obstruct each other.
								$(this).css({ display: "none" }).dequeue();
							});
						slider.animate({ width: "15px" }, { duration: animation.duration, queue: false });
					});
				});
			});
		}
	});
});