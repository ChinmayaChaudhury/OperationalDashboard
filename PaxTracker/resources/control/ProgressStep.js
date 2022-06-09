/**
 * Journey progress bar icon.
 * @module PAX/control/ProgressStep
 * @requires module:sap.m.Button
 */
sap.ui.define(
    ["sap/m/Button"],
    function (Button) {
        /**
         * Creates a new journey progress bar icon.
         * @class ProgressStep
         * @alias module:PAX/control/ProgressStep
         * @extends {sap.m.Button}
         * @param {string} size - Current number of passengers at this step in the journey.
         * @param {string} total - Total number of passengers at this step in the journey.
         */
        return Button.extend("PAX.control.ProgressStep",
            /** @lends module:PAX/control/ProgressStep.prototype */
            {
                metadata: {
                    properties: {
                        /** @property {count} */
                        count: {
                            type: "string", // TODO: change to int
                            defaultValue: "0"
                        },
                        /** @property {total} */
                        total: {
                            type: "string", // TODO: change to int
                            defaultValue: "0"
                        }
                    }
                },
                /**
                 * Renders progress bar icons and injects it into the DOM.
                 * @memberof module:PAX/control/ProgressStep.prototype
                 * @param {sap.ui.core.RenderManager} oRm - RenderManager that will take care for rendering Controls.
                 * @param {sap.ui.core.Control} oControl - The UI control that is injected into the DOM (in our case, sap.m.Button)
                 * @return {void}
                 * @description The method styles sap.m.Button such that it would reflect different stages
                 * in the process. There are four states to consider:
                 * * **Error:** Current count is negative or less than zero (x < 0).
                 * * **Not Started:** Current count is zero (x = 0).
                 * * **Started/In Progress:** Current count positive but less than total count (x > 0 and x < total).
                 * * **Complete:** Current count is equal to or greater than total count (x >= total).
                 */
                renderer: function (oRm, oControl) {
                    /** @todo Remove the integer parser once the properties are changed to int. */
                    const data = {
                        count: parseInt(oControl.getCount()),
                        total: parseInt(oControl.getTotal())
                    };

                    // Error: x < 0
                    // Not started: x == 0
                    // Started: x < total
                    // Complete x >= total
                    if (data.count < 0) {
                        oControl.addStyleClass('error');
                        oControl.setIcon("sap-icon://warning");
                    } else if (data.count == 0) {
                        oControl.addStyleClass('notStarted');
                    } else if (data.count < data.total) {
                        oControl.addStyleClass('started');
                        oControl.setIcon("sap-icon://synchronize");
                    } else {
                        oControl.addStyleClass('complete');
                        oControl.setIcon("sap-icon://accept");
                    }

                    // Calls sap.m.Button default renderer
                    sap.m.ButtonRenderer.render(oRm, oControl)
                }
            });
    }
);