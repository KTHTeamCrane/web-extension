import * as gateway from "./utils/gateway";
import { loadWhitelist, isURLNewsSource, setTimeoutAsync } from "./utils/util";
import * as storage from "./storage"


let testChecks = [
    {
        LABEL: "FALSE",
        EXCERPT: "Angela Merkel will release her long-awaited memoirs in November under the title Freedom:",
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
        EXCERPT: "Leading up to Cohen's testimony, Mr Trump and his ex-attorney traded fiery insults on social media",
        EXPLANATION: "because you suck",
        SOURCES: []
    },
    {
        LABEL: "PARTIALLY TRUE",
        EXCERPT: "The flag furore is the latest controversy to hit this year’s competition in Malmӧ,",
        EXPLANATION: "because you suck",
        SOURCES: []
    }
]


function handleFactCheckArticle(sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        /* Check if possible to even run article autodetect */
        let toggleState = await storage.getStateAutoDetect();
        if (toggleState.autoDetect == false) {
            sendResponse({ error: "Auto detect articles is disabled" });
            return;
        }

        if (!tabs[0]) {
            sendResponse({ error: "No active tab" });
            return;
        }

        await loadWhitelist();
        if (!isURLNewsSource(tabs[0].url)) {
            sendResponse({ error: "URL not in whitelist" });
            return;
        }

        const htmlReq = await fetch(tabs[0].url);
        const html = await htmlReq.text();


        // /* Run cache check */
        // let cacheCheck = await storage.returnCachedResult(tabs[0].url);
        // if (cacheCheck.found === true) {
        //     console.log("Background.js: Website was found in the cache.")
        //     sendResponse({ html, url: tabs[0].url, checks: cacheCheck.cachedResult });
        //     return;
        // }
        
        /* If website does not exist in cache */
        await setTimeoutAsync(1000);

        try {
            // const checks = await gateway.fetchArticleClaimText(
            //     html, tabs[0].title, tabs[0].url
            // )
            console.log("Backgroud.js: Website was not found, trying to run fact checking")
            const checks = testChecks;
            await storage.addToWebsiteCache(checks, tabs[0].url);
            sendResponse({ html, url: tabs[0].url, checks });
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
            const checks = await gateway.testFetchSingleClaimCheck(claim)
            sendResponse({ checks: checks })
        } catch (error) {
            sendResponse({ error: error.message })
        }
    });
    return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get-items") storage.getItems(sendResponse)
    else if (request.action === "set-auto-detect") storage.setStateAutoDetect(request.value)
    else if (request.action === "set-highlight-enabled") storage.setHighlightEnabled(request.value)
    else if (request.action === "fact-check-article") handleFactCheckArticle(sendResponse)
    else if (request.action === "fact-check-single-claim") handleFactCheckSingleClaim(request.value, sendResponse)
    return true
})


storage.initialiseStorage()