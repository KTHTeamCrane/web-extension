import * as gateway from "./utils/gateway";
import { loadWhitelist, isURLNewsSource, setTimeoutAsync } from "./utils/util";


let testChecks = [
    {
        LABEL: "FALSE",
        EXCERPT: "The regional governor said two bodies had been pulled from the rubble",
        EXPLANATION: "because you suck",
        SOURCES: [{
            type: "ARTICLE",
            source_idx: -1,
            source_publisher: "BBC",
            url: "https://google.com"
        }]
    },
    {
        LABEL: "TRUE",
        EXCERPT: "The Belgorod region has often been targeted by Ukrainian forces since the",
        EXPLANATION: "because you suck",
        SOURCES: []
    },
    {
        LABEL: "FALSE",
        EXCERPT: "Earlier, the FBI said it was looking into the case and was in touch with international partners.",
        EXPLANATION: "because you suck",
        SOURCES: []
    }
]

/**
 * Checks if the `autoDetect` and `highlightEnabled` keys have been set. 
 * 
 * If it has not been, then the keys are initialised.
 */
function initialiseStorage() {
    chrome.storage.local.get(["autoDetect"]).then((v) => {
        if (v.autoDetect == undefined) {
            console.log("Keys were not initialised")
            chrome.storage.local.set({ autoDetect: true }).then(() => {
                chrome.storage.local.set({ highlightEnabled: true })
            })
        } else console.log("Keys were indeed initialised")
    })
}

function handleStorageGetItems(sendResponse) {
    console.log("handleStorageGetItems")
    chrome.storage.local.get("autoDetect").then((v1) => {
        chrome.storage.local.get("highlightEnabled").then((v2) => {
            console.log("states from background", v1.autoDetect, v2.highlightEnabled)
            sendResponse({
                stateAutoDetect: v1.autoDetect,
                stateHighlightEnabled: v2.highlightEnabled
            })
        })
    })
}

function getToggleStateAutoDetect() {
    return chrome.storage.local.get("autoDetect")
}

function handleStorageSetAutoDetect(nv) {
    console.log("handleStorageSetAutoDetect")
    chrome.storage.local.set({ autoDetect: nv })
}

function handleStorageSetHighlightEnabled(nv) {
    console.log("handleStorageSetHighlightEnabled")
    chrome.storage.local.set({ highlightEnabled: nv })
}

function handleFactCheckArticle(sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        await loadWhitelist()
        let toggleState = await getToggleStateAutoDetect()
        if (toggleState.autoDetect == false) {
            console.log("Toggle State has been disabled")
            sendResponse({ error: "Auto detect articles is disabled" })
            return
        }

        if (!tabs[0]) {
            sendResponse({ error: "No active tab" });
            return;
        }

        if (!isURLNewsSource(tabs[0].url)) {
            sendResponse({ error: "URL not in whitelist" });
            return;
        }

        await setTimeoutAsync(1000);

        try {
            const htmlReq = await fetch(tabs[0].url)
            const html = await htmlReq.text()
            // const checks = await gateway.fetchArticleClaimText(
            //     html, tabs[0].title, tabs[0].url
            // )
            const checks = testChecks;
            sendResponse({ html, url: tabs[0].url, checks })
        } catch (error) {
            sendResponse({ error: error.message });
        }
    });
    return true;
}

function handleFactCheckSingleClaim(claim, sendResponse) {
    console.log("Handle Fact Check", claim)
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        try {
            // const checks = await gateway.fetchSingleClaimCheck(claim)
            const checks = await gateway.testFetchSingleClaimCheck(claim)
            sendResponse({ checks: checks })
        } catch (error) {
            sendResponse({ error: error.message })
        }
    });
    return true;
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.query !== "getCurrentTabHtml") return;

//     chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
//         await loadWhitelist()

//         if (!tabs[0]) {
//             sendResponse({ error: "No active tab" });
//             return;
//         }

//         if (!isURLNewsSource(tabs[0].url)) {
//             sendResponse({ error: "URL not in whitelist" });
//             return;
//         }

//         await setTimeoutAsync(1000);

//         try {
//             const htmlReq = await fetch(tabs[0].url);
//             const html = await htmlReq.text();
//             // const checks = await fetchArticleClaimText(
//             //     html, tabs[0].title, tabs[0].url
//             // );
//             const checks = testChecks;
//             sendResponse({ html, url: tabs[0].url, checks });
//         } catch (error) {
//             sendResponse({ error: error.message });
//         }
//     });
//     return true;
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get-items") handleStorageGetItems(sendResponse)
    else if (request.action === "set-auto-detect") handleStorageSetAutoDetect(request.value)
    else if (request.action === "set-highlight-enabled") handleStorageSetHighlightEnabled(request.value)
    else if (request.action === "fact-check-article") handleFactCheckArticle(sendResponse)
    else if (request.action === "fact-check-single-claim") handleFactCheckSingleClaim(request.value, sendResponse)
    return true
})


initialiseStorage()