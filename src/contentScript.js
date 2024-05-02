'use strict';

import tippy from "tippy.js"
import TextHighlighter from '@perlego/text-highlighter';
import Independencia from "@perlego/text-highlighter/src/highlighters/independencia"
const { unit, addTooltip, applyPageHighlights } = require("./utils/util");
const highlighter = new TextHighlighter(document.body, {
    useDefaultEvents: false,
    version: "independencia"
})
import css from "./services/css/highlight.css"



function highlightText(claims) {
    claims.forEach((each_e) => {
        applyPageHighlights(each_e, "#ff2")
    })

}


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

        highlightText([{
            LABEL: "TRUE",
            EXCERPT: "Golden Dawn rose to prominence during Greece’s near decade-long debt crisis",
            REASON: "some reason",
            SOURCES: [
                "BBC",
                "CNN"
            ]
        }])
    })
}

if (document.readyState !== 'loading') {
    console.log("DOM already loaded")
    sendMessageToBackground()
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("Still loading DOM")
        sendMessageToBackground()
    });
}
