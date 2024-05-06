/**
 * 
 * @param {string} html HTML content of the page
 * @returns True if the HTML contains an article tag
 */
export function isHTMLArticle(html) {
    return html.includes("<article>") || html.includes("\"article:tag\"");
}

/**
 * Fact check an article from the page HTML.
 * 
 * Returns a promise that resolves to an array of fact-check results.
 * 
 * @param {string} html HTML of the article to be fact-checked
 * @returns {Promise<{label: string, excerpt: string, reason: string, sources: string[]}[]>}
 */
export async function fetchHTMLFactCheck(html) {
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

const WHITELIST_URL = "https://raw.githubusercontent.com/KTHTeamCrane/.github/json/whitelist.json"
const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";

let newsSourceWhitelist; 

/**
 * Loads the whitelist from Github.
 */
export async function loadWhitelist() {
    let fetchResult = await fetch(WHITELIST_URL)
    newsSourceWhitelist = await fetchResult.json()
    newsSourceWhitelist = newsSourceWhitelist.whitelist
}

/**
 * 
 * @param {string} url URL of the page
 * @returns True if the URL is in the news source whitelist
 */
export function isURLNewsSource(url) {
    return newsSourceWhitelist.some(newsSource => url.startsWith(newsSource));
}



export async function setTimeoutAsync(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}