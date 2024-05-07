'use strict';

import css from "./popup.css"

const KEY_AUTO_DETECT = "toggle-auto-detect"
const KEY_HIGHLIGHT = "toggle-enable-highlight"

const toggleAutoDetect = document.getElementById(KEY_AUTO_DETECT)
const toggleHighlight = document.getElementById(KEY_HIGHLIGHT)

const stateAutoDetect = localStorage.getItem(KEY_AUTO_DETECT)
const stateHighlight = localStorage.getItem(KEY_HIGHLIGHT)


if (stateAutoDetect !=  null) {
    toggleAutoDetect.checked = stateAutoDetect.toLowerCase() === 'true'
}

if (stateHighlight != null) {
    toggleHighlight.checked = stateHighlight.toLowerCase() === 'true'
}

toggleAutoDetect.addEventListener("change", () => {
    localStorage.setItem(KEY_AUTO_DETECT, toggleAutoDetect.checked.toString())
})

toggleHighlight.addEventListener("change", () => {
    localStorage.setItem(KEY_HIGHLIGHT, toggleHighlight.checked.toString())
})

chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { highlightEnabled: toggleHighlight.checked.toString().toLowerCase() === 'true' })
});