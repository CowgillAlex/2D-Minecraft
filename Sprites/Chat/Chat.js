/* eslint-disable require-yield, eqeqeq */

import {
    Sprite,
    Trigger,
    Watcher,
    Costume,
    Color,
    Sound,

} from "../../cdn.js";
import Utils from "../../Utilities/utils.js";
export default class Chat extends Sprite {
    constructor(...args) {
        super(...args);
        Utils.log("log", "[Chat] Loading Costumes")
        this.costumes = []
        Utils.log("log", "[Chat] Loading Sounds")
        this.sounds = [];
        Utils.log("log", "[Chat] Loading Triggers")
        this.triggers = [
            new Trigger(
                Trigger.KEY_PRESSED,
                { key: "t" },
                this.whenKeyTPressed
            )
        ];

    }
    whenKeyTPressed() {
        Utils.log("log", "T key pressed");
    
        // Check if the textarea already exists to avoid creating multiple ones
        if (!document.getElementById('minecraftChatBox')) {
            const textArea = document.createElement('textarea');
            textArea.id = 'minecraftChatBox';
            textArea.placeholder = 'Type your message here...';
            textArea.style.position = 'fixed';
            textArea.style.bottom = '0';
            textArea.style.left = '0';
            textArea.style.width = 'calc(100% - 100px)'; // Leave space for the button
            textArea.style.height = '50px';
            textArea.style.backgroundColor = '#1C1C1C';
            textArea.style.color = '#FFFFFF';
            textArea.style.border = 'none';
            textArea.style.padding = '10px';
            textArea.style.fontSize = '16px';
            textArea.style.fontFamily = 'monospace';
            textArea.style.outline = 'none';
            textArea.style.zIndex = '1000';
    
            const submitButton = document.createElement('button');
            submitButton.id = 'submitButton';
            submitButton.innerText = 'Submit';
            submitButton.style.position = 'fixed';
            submitButton.style.bottom = '0';
            submitButton.style.right = '0';
            submitButton.style.width = '100px';
            submitButton.style.height = '50px';
            submitButton.style.backgroundColor = '#4CAF50';
            submitButton.style.color = '#FFFFFF';
            submitButton.style.border = 'none';
            submitButton.style.fontSize = '16px';
            submitButton.style.fontFamily = 'monospace';
            submitButton.style.cursor = 'pointer';
            submitButton.style.outline = 'none';
            submitButton.style.zIndex = '1000';
    
            // Function to handle the submit action
            submitButton.addEventListener('click', function() {
                const message = textArea.value;
                Utils.log("log", message);
    
                // Remove the textarea and button from the DOM
                document.body.removeChild(textArea);
                document.body.removeChild(submitButton);
            });
    
            document.body.appendChild(textArea);
            document.body.appendChild(submitButton);
            textArea.focus(); // Focus on the textarea immediately
        }
    }


}