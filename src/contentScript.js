'use strict';
// const { applyPageHighlights  = require("./utils/highlighting");
import * as highlighting from "./utils/highlighting"
import css from "./utils/css/tooltip.css"
import * as gatewayApi from './utils/gateway';


/**
 * Tracks if highlighting is enabled.
 * 
 * When highlighting is enabled, the user can select a text 
 * and send it off for fact checking.
 */
let highlightToggleEnabled = false

/**
 * Checks if the user has pressed the `S` key. This will allow user to highlight texts
 * to fact check claims.
 */
let highlightShortcutEnabled = false


/**
 * Sends a message to `background.js` and waits for the reply.
 * 
 * `background.js` returns the HTML of the current page.
 * 
 * `background.js` also talks with `api-gateway` to retrieve "fact-checked" claims as well.
 * 
 */
function sendMessageToBackground() {
    chrome.runtime.sendMessage({ action: "fact-check-article" }, async (msgResponse) => {
        if (!msgResponse.error) highlighting.applyPageHighlights(msgResponse.checks)
        else console.log(msgResponse.error)
    })
}

// Checks if the document is in loading state, in which case adds a listener to run when DOMContent is loaded
if (document.readyState !== 'loading') {
    console.log("DOM already loaded")
    sendMessageToBackground()
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("Still loading DOM")
        sendMessageToBackground()
    });
}

document.onkeydown = () => {
    console.log("Sending message to background script to get items")
    chrome.runtime.sendMessage({ action: "get-items" }, (msgResponse) => {
        console.log(msgResponse)
        if (msgResponse.stateHighlightEnabled) {
            if (highlightShortcutEnabled) highlightShortcutEnabled = false
            else highlightShortcutEnabled = true
        }
        console.log("Highlighting enabled: ", highlightShortcutEnabled)
    })
}

document.onmouseup = async () => {
    if (highlightShortcutEnabled) {
        let selectedText = document.getSelection().toString()
        highlighting.highlightSinglePendingCheck(selectedText)
        chrome.runtime.sendMessage({ action: "fact-check-single-claim", value: selectedText }, async (msgResponse) => {
            if (msgResponse.error != undefined) {
                console.log("Encountered error", msgResponse.error)
                return
            }
            console.log(msgResponse.checks)
            highlighting.highlightCheck(msgResponse.checks)
        })
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        highlightToggleEnabled = request.highlightEnabled
        console.log("Highlighting enabled from popup", highlightToggleEnabled)
    }
);
