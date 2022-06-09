sap.ui.define([
	"sap/ui/core/Control",
	"PAX/control/map/libs/Tween",
	"PAX/control/map/libs/renderer"
],
	function (Control, Tween, renderer) {
		return Control.extend("PAX.control.map.Map", {
			metadata: {
				properties: {
					currentLevel: {
						type: "string"
					}
				}
			},

			init: function () {
				// Initialize OSMBuildings object
				this.map = new OSMBuildings({
					baseURL: './libs',
					minZoom: 16,
					maxZoom: 20.5,
					position: {
						latitude: 25.250134,
						longitude: 55.354247
					},
					rotation: 1.1,
					tilt: 45,
					zoom: 18.5,
					state: false,
					showBackfaces: false,
					attribution: '',
					fastMode: true,
					backgroundColor: '#e8e0d8',
					highlightColor: '#f08000',
				});

				// Pins
				this.pins = [];
			},

			renderer: function (oRm, oControl) {
				oRm.write("<div");
				oRm.writeControlData(oControl);
				oRm.addClass("map");
				oRm.writeClasses();
				oRm.writeAttribute("oncontextmenu", "return false;");
				oRm.write(">");
				oRm.write("</div>");
			},

			onAfterRendering: function () {
				const self = this;

				$(".map").click(function(e){
					let offset = $(this).offset(),
						x = e.clientX - offset.left, 
						y = e.clientY - offset.top;
					const location = self.map.unproject(x, y);
					console.log(`["U", 1, "CBU2", ${location.latitude}, ${location.longitude}]`);
				});
				

				// Inject map object to DOM
				this.map.appendTo(this.getId());

				// Load levels' camera & locations data
				const cameraURI = "control/map/camera/levels.json";
				const locationsURI = "control/map/POI/locations.json";

				$.when($.getJSON(cameraURI), $.getJSON(locationsURI))
					.then((camera, locations) => {
						// Initialize properties with config data
						self.camera = camera[0];
						self.locations = locations[0];

						// Load current level
						self.loadLevel(self.getCurrentLevel());

						// Whenever the camera moves, we reposition a passenger's pin/marker
						self.map.on("change", () => {
							$('.pin').each((i, e) => {
								const pin = {
									x: $(e).data('x'),
									y: $(e).data('y'),
									z: $(e).data('z')
								};

								const position = self.map.project(pin.x, pin.y, pin.z);

								$(e).data('x', pin.x);
								$(e).data('y', pin.y);
								$(e).data('z', pin.z);

								// Re-position the passenger's pin/marker
								$(e).css({
									left: position.x,
									top: position.y
								});
							});
						});
					});
			},

			loadLevel: function (selectedLevel) {
				const self = this;

				// Refresh canvas (i.e. viewport)
				if (selectedLevel != this.getCurrentLevel()) {
					// Set current level to the selected one
					this.setCurrentLevel(selectedLevel);

					// Remove all markers
					this.pins = [];

					// Remove all objects
					for (const object in this.objects) {
						this.objects[object].destroy();
					}
				}

				// Setup camera
				const from = this.camera[selectedLevel];

				this.map.setPosition({
					latitude: from.latitude,
					longitude: from.longitude
				});
				this.map.setRotation(from.rotation);
				this.map.setZoom(from.zoom);
				this.map.setTilt(from.tilt);

				// Load level geo-features & 3D models
				$.getJSON(`control/map/features/${selectedLevel}.json`, features => {
					self.map.addGeoJSON(features, {
						elevation: 0.1
					});

					self.objects = self.loadObjects(selectedLevel);
				});
			},

			loadObjects: function (selectedLevel) {
				const objects = {};

				for (const [objectKey, objectPositions] of Object.entries(this.locations)) {
					for (const object of objectPositions) {
						if (object.level == selectedLevel) {
							const addedObject = this.map.addOBJ(`./control/map/models/${objectKey}`, {
								"latitude": object.latitude,
								"longitude": object.longitude
							}, {
									"minZoom": object.minZoom ? object.minZoom : 17,
									"maxZoom": object.maxZoom ? object.maxZoom : 21,
									"fadeIn": Boolean(object.fadeIn),
									"id": object.id,
									"scale": object.scale ? object.scale : 4,
									"elevation": object.elevation ? object.elevation : 4,
									"rotation": object.rotation
								});

							objects[objectKey] = addedObject;
						}
					}
				}

				return objects;
			},

			addPin: function (id, level, latitude, longitude) {
				const pin = {
					id: id,
					x: latitude,
					y: longitude,
					z: 4
				};

				// Skip if the pushed pin isn't at the correct location
				if (level != this.getCurrentLevel()) {
					return;
				}

				// Here, we map 3D coordinates (geo-referenced) to the 2D plane (screen position)
				let position = this.map.project(pin.x, pin.y, pin.z);

				if (!this.pins.map(d => d.id).includes(pin.id)) {
					// Construct a passenger's pin/marker for each one of those objects
					$(`<div class='pin' data-id="${pin.id}" data-x="${pin.x}" data-y="${pin.y}" data-z="${pin.z}"></div>`)
						.css({
							left: position.x,
							top: position.y
						}).appendTo(`#${this.getId()}`);

					this.pins.push(pin);
				} else {
					const self = this;

					// Update pin location
					this.pins.forEach(d => {
						if (pin.id == d.id) {
							var coords = { x: d.x, y: d.y };
							var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
								.to({ x: pin.x, y: pin.y }, 1000) // Move to (300, 200) in 1 second.
								.easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
								.onUpdate(function () { // Called after tween.js updates 'coords'.
									// Move 'box' to the position described by 'coords' with a CSS translation.
									// console.log("x = " + coords.x + " y = " + coords.y);
									position = self.map.project(coords.x, coords.y, pin.z);
									$(`.pin[data-id=${pin.id}]`).css({
										left: position.x,
										top: position.y
									});
									d.x = coords.x;
									d.y = coords.y;
								})
								.start();
								function animate(time) {
									requestAnimationFrame(animate);
									TWEEN.update(time);
								}
								requestAnimationFrame(animate);
						}
					});
				}
			}
		});
	}
);