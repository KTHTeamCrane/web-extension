import { setTimeoutAsync } from "./util";

const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";
// const API_URL = "http://localhost:8000";

export async function fetchSingleClaimCheck(claim) {
    await setTimeoutAsync(4000)
    return {
        LABEL: "True",
        EXCERPT: claim,
        EXPLANATION: "This reason was determined false because fuck you",
        SOURCES: [
            "cnn.com", "bbc.com"
        ]
    }
}

/**
 * Fact check an article from the page HTML.
 * 
 * Returns a promise that resolves to an array of fact-check results.
 * 
 * @param {string} html HTML of the article to be fact-checked
 * @param {string} title Title of the current article
 * @param {string} url URL of the current article
 * @returns {Promise<{LABEL: string, EXCERPT: string, EXPLANATION: string, SOURCES: string[]}[]>}
 */
export async function fetchArticleClaimText(html, title, url) {
    const body = { article_html: html, article_title: title, article_url: url };
    const checkReq = await fetch(`${API_URL}/api/article/extract-and-fact-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (checkReq.status !== 200) {
        console.log('Error:', checkReq.status);
        return;
    }

    return checkReq.json();
}
