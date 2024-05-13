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
    const parent = getElementThatIncludes(check.EXCERPT)

    const main = document.body
    console.log("main", check.EXCERPT, main.innerText.includes(check.EXCERPT, 0))
    if (parent == null) {
        console.log("No element found with matching text")
        return
    }

    const textContent = parent.textContent
    const matchIndex = textContent.indexOf(check.EXCERPT)

    const textBefore = textContent.substring(0, matchIndex);
    let matchText = textContent.substring(matchIndex, matchIndex + check.EXCERPT.length);
    const textAfter = textContent.substring(matchIndex + check.EXCERPT.length);


    const spanBefore = copyHTMLTextRange(parent, textBefore)
    const spanMatching = copyHTMLTextRange(parent, matchText)
    const spanAfter = copyHTMLTextRange(parent, textAfter)

    spanMatching.classList.add(labelToClass(check.LABEL))

    parent.innerHTML = ""
    parent.appendChild(spanBefore)
    parent.appendChild(spanMatching)
    parent.appendChild(spanAfter)

    if (check.LABEL == "Pending") {
        tooltip.addPendingTooltip(spanMatching, check)
    } else {
        tooltip.addTooltip(spanMatching, check)
    }

}

/**
 * Takes in a parent HTMLElement and a matchingText.
 * 
 * If the matchingText exists in the parent's inner text (not inner HTML), then everything surrounding the matching
 * text is copied and returned. This means if parts of the matchingText is inside another tag, those tags will also be copied.
 * 
 * @param {HTMLElement} parent Parent element, that can be passed without checking if parent has an element
 * @param {String} matchingText The text to be copied, ignoring any HTML tags. HTML tags will be copied.  
 */
function copyHTMLTextRange(parent, matchingText) {
    const span = document.createElement("span")

    let matchText = matchingText
    if (parent.children[0]) {
        for (let i = 0; i < parent.children.length; i++) {
            const each_child = parent.children[i]
            if (matchText.includes(each_child.innerText)) {
                const beforeChild = document.createElement("span")

                const split = matchText.split(each_child.innerText)

                beforeChild.innerText = split[0]

                span.appendChild(beforeChild)
                span.appendChild(each_child)
                matchText = split[1] == undefined ? "" : split[1]
            }
        }
        const afterChild = document.createElement("span")
        afterChild.innerHTML = matchText
        span.appendChild(afterChild)
    } else {
        span.innerHTML = matchingText
    }

    return span
}



function getElementThatIncludes(text) {
    const all = document.getElementsByTagName("p")
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
