import { setTimeoutAsync } from "./util";

const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";
// const API_URL = "http://localhost:8000";

export async function fetchSingleClaimCheck(claim) {
    const body = { article: claim }
    const checkReq = await fetch(`${API_URL}/api/article/fact-check-text`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify(body)
    })
   
    if (checkReq.status !== 200) {
        console.log('Error:', checkReq.status);
        return;
    }

    return checkReq.json();
}

export async function testFetchSingleClaimCheck(claim) {
    await setTimeoutAsync(40)
    return {
        EXCERPT: claim,
        LABEL: "false",
        EXPLANATION: "This claim has been determined to be false because the code is depressed.",
        SOURCES: ["Mark Henry said so"]
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
