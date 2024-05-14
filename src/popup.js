'use strict';

import css from "./popup.css"

// const KEY_AUTO_DETECT = "toggle-auto-detect"
// const KEY_HIGHLIGHT = "toggle-enable-highlight"

const toggleAutoDetect = document.getElementById("toggle-auto-detect")
const toggleHighlight = document.getElementById("toggle-enable-highlight")

// const stateAutoDetect = localStorage.getItem(KEY_AUTO_DETECT)
// const stateHighlight = localStorage.getItem(KEY_HIGHLIGHT)


// if (stateAutoDetect !=  null) {
//     toggleAutoDetect.checked = stateAutoDetect.toLowerCase() === 'true'
// }

// if (stateHighlight != null) {
//     toggleHighlight.checked = stateHighlight.toLowerCase() === 'true'
// }

chrome.runtime.sendMessage( { action: "get-items" }, async (msgResponse) => {
    toggleAutoDetect.checked = msgResponse.stateAutoDetect
    toggleHighlight.checked = msgResponse.stateHighlightEnabled
})

toggleAutoDetect.addEventListener("change", () => {
    chrome.runtime.sendMessage({ action: "set-auto-detect", value: toggleAutoDetect.checked})
})

toggleHighlight.addEventListener("change", () => {
    chrome.runtime.sendMessage({ action: "set-highlight-enabled", value: toggleHighlight.checked})
})

// chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, { highlightEnabled: toggleHighlight.checked.toString().toLowerCase() === 'true' })
// });