//import Utils  from "./utils.js";
const keyState = {};

// Add event listeners to track key states
document.addEventListener('keydown', (event) => {
    //Utils.log("log", "Key Pressed: " + event.code)
    keyState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

// Functions to check if a specific key is pressed down
export default function isKeyDown(keyCode) {
    return !!keyState[keyCode];
}
