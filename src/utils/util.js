import tippy from "tippy.js"
import { addTooltip } from "./tooltip"


export function unit() {
    console.log("Unit")
}

/**
 * Creates a new div element with provided highlight class and appends the div element to the node.
 * @param {HTMLElement} parent The immediate parent node
 * @param {string} targetText The text that is to appear within the highlighted section
 * @param {string} label Can be TRUE, PARTIAL or FALSE 
 */
export function addHighlight(parent, targetText, label) {
    let div = document.createElement("div")
    div.classList.add(`ltms-highlight-${label.toLowerCase()}`)
    div.innerText = targetText

    // Append div as a child
    parent.appendChild(div)

}


export function applyPageHighlights(check, color) {

    const targetText = check.EXCERPT
    console.log(targetText)

    const recursivelyHighlightText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent;
            const matchIndex = textContent.indexOf(targetText);
            if (matchIndex >= 0) {
                console.log("found")
                const beforeMatch = document.createTextNode(textContent.substring(0, matchIndex));
                const matchText = document.createElement('span');
                matchText.id = "ltms-match-text"
                const container = document.createElement("span");
                container.classList.add("ltms-container")


                const highlightedText = document.createElement("span")
                highlightedText.classList.add("ltms-highlighted-text")
                highlightedText.style.backgroundColor = color

                
                highlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));

                container.appendChild(highlightedText)
                tippy("#ltms-match-test", {
                    "content": "Hello World"
                })  
                addTooltip(container, check)

                matchText.appendChild(container)


                const parent = node.parentNode;
                parent.insertBefore(beforeMatch, node);
                parent.insertBefore(matchText, node);
                parent.insertBefore(afterMatch, node);
                parent.removeChild(node);
                return true;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (const child of Array.from(node.childNodes)) {
                if (recursivelyHighlightText(child)) {
                    break;
                }
            }
        }
        return false;
    };

    recursivelyHighlightText(document.body);
}

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
 * @param {string} html HTML of the article to be fact-checked
 * @returns {Promise<{label: string, excerpt: string, reason: string, sources: string[]}[]>}
 * Returns a promise that resolves to an array of fact-check results.
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
