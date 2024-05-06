import { loadWhitelist, isURLNewsSource, setTimeoutAsync } from "./utils/util";


let testChecks = [
    {
        LABEL: "False",
        EXCERPT: "Relatives of the three men identified their bodies on Sunday after travelling to Mexico to assist authorities, a state prosecutor said.",
        EXPLANATION: "because you suck",
        SOURCES: ["bbc.com", "cnn.com"]
    }
]

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.query !== "getCurrentTabHtml") return;

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        await loadWhitelist()

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
            const htmlReq = await fetch(tabs[0].url);
            const html = await htmlReq.text(); 

            // const checks = await fetchHTMLFactCheck(html);
            const checks = testChecks;
            sendResponse({ html, url: tabs[0].url, checks });
        } catch (error) {
            sendResponse({ error: error.message });
        }
    });
    return true;
});