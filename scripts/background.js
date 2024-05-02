const WHITELIST_URL = "https://raw.githubusercontent.com/KTHTeamCrane/.github/json/whitelist.json"
const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";

let newsSourceWhitelist; 

/**
 * Loads the whitelist from Github.
 */
async function loadWhitelist() {
    let fetchResult = await fetch(WHITELIST_URL)
    newsSourceWhitelist = await fetchResult.json()
    newsSourceWhitelist = newsSourceWhitelist.whitelist
}

/**
 * 
 * @param {string} url URL of the page
 * @returns True if the URL is in the news source whitelist
 */
function isURLNewsSource(url) {
    return newsSourceWhitelist.some(newsSource => url.startsWith(newsSource));
}

/**
 * 
 * @param {string} html HTML content of the page
 * @returns True if the HTML contains an article tag
 */
function isHTMLArticle(html) {
    return html.includes("<article>") || html.includes("\"article:tag\"");
}

async function setTimeoutAsync(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * Fact check an article from the page HTML.
 * @param {string} html HTML of the article to be fact-checked
 * @returns {Promise<{label: string, excerpt: string, reason: string, sources: string[]}[]>}
 * Returns a promise that resolves to an array of fact-check results.
 */
async function fetchHTMLFactCheck(html) {
    const checkReq = await fetch(`${API_URL}/api/article/extract-and-fact-check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ article_html: html }),
    });

    if (checkReq.status !== 200) {
        console.error('Error:', checkReq.statusText);
        return;
    }

    return checkReq.json();
}

let testChecks = [
    {
        LABEL: "False",
        EXCERPT: "His announcement came hours after a Madrid court opened a preliminary investigation into Gómez’s business affairs, following a complaint made by a pressure group whose leader has links to the far right and which frequently brings legal action against those it accuses of acting against Spain’s democratic interests.",
        REASON: "former presidents are not entitled to absolute immunity.",
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

        console.log(newsSourceWhitelist)

        if (!isURLNewsSource(tabs[0].url)) {
            sendResponse({ error: "URL not in whitelist" });
            return;
        }

        await setTimeoutAsync(1000);

        try {
            const htmlReq = await fetch(tabs[0].url);
            const html = await htmlReq.text();

            // TODO: Remove this to do CNN or something. Here to not check
            // root pages for now.
            // if (!isHTMLArticle(html)) {
            //     sendResponse({ error: "HTML is not an article" });
            //     return;
            // }

            const checks = await fetchHTMLFactCheck(html);
            sendResponse({ html, url: tabs[0].url, checks });
        } catch (error) {
            sendResponse({ error: error.message });
        }
    });
    return true;
});
