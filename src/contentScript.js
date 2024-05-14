'use strict';
import * as highlighting from "./utils/highlighting"
import css from "./utils/css/tooltip.css"
import * as gatewayApi from './utils/gateway';
import * as toaster from "./utils/toaster"
import { convertClaimToCheckObject } from "./utils/util";

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
 */
function sendMessageToBackground() {
    console.log("Sending message to background, waiting for response")
    chrome.runtime.sendMessage({ action: "fact-check-article" }, async (msgResponse) => {
        if (msgResponse.error) {
            console.log("Background encountered error", msgResponse.error)
            toaster.errorToast(msgResponse.error).showToast()
            return
        }

        console.log("Received response from background fine")
        toaster.processingToast.hideToast()
        toaster.finishedProcessingToast(msgResponse.cached).showToast()
        console.log(msgResponse.checks)
        highlighting.applyPageHighlights(msgResponse.checks)
    })
}

// Checks if the document is in loading state, in which case adds a listener to run when DOMContent is loaded
if (document.readyState !== 'loading') {
    sendMessageToBackground()
} else {
    document.addEventListener('DOMContentLoaded', function () {
        sendMessageToBackground()
    });
}

document.onkeydown = () => {
    chrome.runtime.sendMessage({ action: "get-items" }, (msgResponse) => {
        if (msgResponse.stateHighlightEnabled) {
            if (highlightShortcutEnabled) highlightShortcutEnabled = false
            else highlightShortcutEnabled = true
        }
    })
}

document.onmouseup = async () => {
    if (highlightShortcutEnabled) {
        let selectedText = document.getSelection().toString()
        const pendingClaims = convertClaimToCheckObject(selectedText)
        const tippy = highlighting.highlightCheck(pendingClaims)
        console.log("tippy", tippy)
        chrome.runtime.sendMessage({ action: "fact-check-single-claim", value: selectedText }, async (msgResponse) => {
            if (msgResponse.error != undefined) {
                return
            }
            highlighting.highlightCheck(msgResponse.checks, tippy)
        })
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.highlightEnabled) {
            highlightToggleEnabled = request.highlightEnabled
        } else if (request.isWebpageArticle) {
            toaster.processingToast.showToast()
        }
    }
);
