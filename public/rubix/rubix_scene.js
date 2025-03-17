
import * as functions from './rubix_functions.js';

document.addEventListener("DOMContentLoaded", () => {
    // Get all buttons inside the container
    document.getElementById("RotationAxisSelectionContainer").addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            functions.SetRotationAxis(event.target.dataset.axis);
        }
    });
});

functions.setup_rubix_scene();

functions.animate_rubix_scene();