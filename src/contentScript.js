'use strict';

import TextHighlighter from '@perlego/text-highlighter';
const { applyPageHighlights, highlightCheck } = require("./utils/highlighting");
const highlighter = new TextHighlighter(document.body, {
    useDefaultEvents: false,
    version: "independencia"
})
import css from "./utils/css/highlight.css"

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

const stateAutoDetect = localStorage.getItem("toggle-auto-detect")