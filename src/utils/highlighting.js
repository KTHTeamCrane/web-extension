import * as tooltip from "./tooltip";

/**
 * Returns the appropriate CSS class that applies highlighting to a text.
 * @param {"TRUE" | "PARTIALLY TRUE" | "FALSE"} label
 * @returns {string}
 */
function labelToClass(label) {
    switch (label) {
        case "TRUE":
            return "ltms-highlighted-true";
        case "PARTIALLY TRUE":
            return "ltms-highlighted-partially-true";
        case "FALSE":
            return "ltms-highlighted-false";
        case "Pending":
            return "ltms-highlighted-pending";
    }
}

/**
 * Takes a `check` object and searches the entire page to find the `excerpt`, then highlights 
 * then highlights that excerpt.
 * @param {{
 *  LABEL: string,
*  EXCERPT: string,
*  EXPLANATION: string,
*  SOURCES: {
*      type: "ARTICLE" | "POLITIFACT" | "UNKNOWN",
*      source_idx: number,
*      raw: string
*      source_title?: string,
*      source_publisher?: string,
*      url?: string}[]
* }} check 
 */
export function highlightCheck(check) {
    // Get all elements in the webpage
    const finalEl = getElementIncludingText(check.EXCERPT)

    if (finalEl == null) {
        return
    }

    const textContent = finalEl.textContent
    const matchIndex = textContent.indexOf(check.EXCERPT)
    console.log(finalEl.innerText.includes(check.EXCERPT))

    if (finalEl.children.length == 0) {
        const beforeMatch = textContent.substring(0, matchIndex);
        const matchText = textContent.substring(matchIndex, matchIndex + check.EXCERPT.length);
        const afterMatch = textContent.substring(matchIndex + check.EXCERPT.length);
        

        const spanBefore = document.createElement("span")
        const spanMatching = document.createElement("span")
        const spanAfter = document.createElement("span")
        
        spanBefore.innerText = beforeMatch
        
        spanMatching.classList.add(labelToClass(check.LABEL))
        spanMatching.innerText = matchText

        spanAfter.innerText = afterMatch

        finalEl.innerHTML = ""
        finalEl.appendChild(spanBefore)
        finalEl.appendChild(spanMatching)
        finalEl.appendChild(spanAfter)


        tooltip.addTooltip(spanMatching, check)
    } else {
        const beforeMatch = textContent.substring(0, matchIndex);
        const matchText = textContent.substring(matchIndex, matchIndex + check.EXCERPT.length);
        const afterMatch = textContent.substring(matchIndex + check.EXCERPT.length);

        const splitMatchText = matchText.split(finalEl.children[0].innerHTML)

        if (splitMatchText.length < 2) {
            // TODO: Do error handling
        }

        const preChildText = document.createElement("span")
        const postChildText = document.createElement("span")


        preChildText.innerText = splitMatchText[0]
        postChildText.innerText = splitMatchText[1]
        

        const spanBefore = document.createElement("span")
        const spanMatching = document.createElement("span")
        const spanAfter = document.createElement("span")

        spanMatching.classList.add(labelToClass(check.LABEL))
        
        spanBefore.innerText = beforeMatch
        spanAfter.innerText = afterMatch  
              
        
        spanMatching.appendChild(preChildText)
        spanMatching.appendChild(finalEl.children[0])
        spanMatching.appendChild(postChildText)

        finalEl.innerHTML = ""
        finalEl.appendChild(spanBefore)
        finalEl.appendChild(spanMatching)
        finalEl.appendChild(spanAfter)
    }
}

/**
 * This function highlights a given text within a provided HTMLElement, given that
 * HTMLElement does not have any further children.
 * 
 * @param {} check Check object in the format from the gateway API.
 * @param {HTMLElement} finalEl The HTMLElement which contains the text that needs to be highlighted.  
 */
function highlightWithoutChildren(finalEl, check) {

}

function highlightWithBabies() {

}


function getElementIncludingText(text) {
    const all = document.getElementsByTagName("*")
    let finalEl = null

    for (var i = 0, max = all.length; i < max; i++) {
        if (all[i].innerText != undefined) {
            if (all[i].innerText.includes(text)) {
                finalEl = all[i]
            }
        }
    }
    return finalEl
}

/**
 * Takes in a list of "fact-checked" `claims` and applies highlighting to all the claims.
 * 
 * Highlighting works only if the provided claim exists within a single HTML element.
 * @param {{
 *  LABEL: string,
*  EXCERPT: string,
*  EXPLANATION: string,
*  SOURCES: {
*      type: "ARTICLE" | "POLITIFACT" | "UNKNOWN",
*      source_idx: number,
*      raw: string
*      source_title?: string,
*      source_publisher?: string,
*      url?: string}[]
* }[]} claims 
 */
export function applyPageHighlights(claims) {
    claims.forEach((each_e) => {
        highlightCheck(each_e)
    })
}


export function highlightSinglePendingCheck(targetText) {
    const recursivelyHighlightText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent;
            const matchIndex = textContent.indexOf(targetText);
            if (matchIndex >= 0) {
                const beforeMatch = document.createTextNode(textContent.substring(0, matchIndex));
                const matchText = document.createElement('span');
                matchText.id = "ltms-match-text"
                const container = document.createElement("span");
                container.classList.add("ltms-container")

                const highlightedText = document.createElement("span")
                highlightedText.classList.add(`ltms-highlighted-pending`)

                highlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));

                container.appendChild(highlightedText)
                tooltip.addPendingTooltip(container)
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