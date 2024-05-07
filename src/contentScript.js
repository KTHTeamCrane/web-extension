'use strict';
const { applyPageHighlights, highlighting } = require("./utils/highlighting");
import css from "./utils/css/highlight.css"
import { gatewayAPI } from './utils/gateway';

/**
 * Tracks if highlighting is enabled.
 * 
 * When highlighting is enabled, the user can select a text 
 * and send it off for fact checking.
 * 
 * TODO: Make variable names more discrete
 */
let highlightingEnabled = false

// TODO: Make variable names more discrete
let allowTextHighlight = false


/**
 * Sends a message to `background.js` and waits for the reply.
 * 
 * `background.js` returns the HTML of the current page.
 * 
 * `background.js` also talks with `api-gateway` to retrieve "fact-checked" claims as well.
 * 
 */
function sendMessageToBackground() {
    chrome.runtime.sendMessage({ query: "getCurrentTabHtml" }, async (msgResponse) => {
        if (!msgResponse) {
            console.log('Error: No response received')
            return
        }

        if (!msgResponse.html) {
            console.log('Error:', msgResponse.error)
            return
        }

        // if (!msgResponse.checks) {
        applyPageHighlights(msgResponse.checks)
        // }
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
    if (highlightingEnabled) {
        if (allowTextHighlight) allowTextHighlight = false
        else allowTextHighlight = true
    }
    console.log("Highlighting is allowed", allowTextHighlight)
}

document.onmouseup = async () => {
    if (allowTextHighlight) {
        let selectedText = document.getSelection().toString()
        highlighting.highlightSinglePendingCheck(selectedText)
        let factChecked = await gatewayAPI.fetchSingleClaimCheck(selectedText)
        highlighting.highlightSingleCheck(factChecked)
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        highlightingEnabled = request.highlightEnabled
        console.log("Highlighting enabled from popup", highlightingEnabled)
    }
);
