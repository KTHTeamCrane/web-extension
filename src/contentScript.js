'use strict';
// const { applyPageHighlights  = require("./utils/highlighting");
import * as highlighting from "./utils/highlighting"
import css from "./utils/css/tooltip.css"
import * as gatewayApi from './utils/gateway';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { convertClaimToCheckObject } from "./utils/util";


const processingToast = Toastify({
    text: "We've detected an article and are detecting if the article makes truthful claims",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 10000
})

const finishedProcessingToast = Toastify({
    text: "We've completed fact-checking the article, highlighting key points. Hover over these sections for explanations on our markings.",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 3000
})

const errorToast = Toastify({
    text: "We've completed fact-checking the article, highlighting key points. Hover over these sections for explanations on our markings.",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 3000
})
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
        processingToast.showToast()
        if (!msgResponse.error) {
            highlighting.applyPageHighlights(msgResponse.checks)
        }
        else console.log(msgResponse.error)
        processingToast.hideToast()
        finishedProcessingToast.showToast()
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
        const pendingClaims = convertClaimToCheckObject(selectedText)
        highlighting.highlightCheck(pendingClaims)
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
