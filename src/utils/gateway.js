import { setTimeoutAsync } from "./util";

const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";

class GatewayAPI {
    async fetchSingleClaimCheck(claim) {
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
     * @returns {Promise<{label: string, excerpt: string, reason: string, sources: string[]}[]>}
     */
    async fetchArticleClaimText(html) {
        const checkReq = await fetch(`${API_URL}/api/article/extract-and-fact-check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ article_html: html }),
        });

        if (checkReq.status !== 200) {
            console.log('Error:', checkReq.status);
            return;
        }

        return checkReq.json();
    }
}

export const gatewayAPI = new GatewayAPI()