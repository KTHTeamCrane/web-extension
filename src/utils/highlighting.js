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
export function highlightCheck(check, tippy) {
    check.EXCERPT = check.EXCERPT.trim().replace(/^s+|\s+$/g, '')
    // Get all elements in the webpage
    let parent = getParagraphThatIncludes(check.EXCERPT)

    if (parent == null) {
        console.error("Could not highlight since no element found with matching text")
        return
    }

    if (tippy) {
        tippy.destroy()
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
    parent.classList.add("ltms-pin")

    parent.innerHTML = ""
    parent.appendChild(spanBefore)
    parent.appendChild(spanMatching)
    parent.appendChild(spanAfter)

    if (check.LABEL == "Pending") {
        return tooltip.addPendingTooltip(spanMatching, check)
    } else {
        return tooltip.addTooltip(spanMatching, check)
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
            let each_child = parent.children[i]
            removeAllLTMSClasses(each_child)
            if (matchText.includes(each_child.innerText)) {
                const beforeChild = document.createElement("span")

                const split = matchText.split(each_child.innerText)
                if (split[0]) {
                    beforeChild.innerText 
                }

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

/**
 * Removes all highlighting related CSS classes from a node,
 * 
 * This is needed for pending highlights.
 * @param {HTMLElement} node 
 */
function removeAllLTMSClasses(node) {
    node.classList.remove("ltms-highlighted-true")
    node.classList.remove("ltms-highlighted-pending")
    node.classList.remove("ltms-highlighted-false")
    node.classList.remove("ltms-highlighted-partially-true")
}


/**
 * Returns the paragraph <p> who's innerText matches the provided text.
 * 
 * @param {string} text 
 * @returns HTMLElement | null
 */
function getParagraphThatIncludes(text) {
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
    console.log("Applying highighting")
    claims.forEach((each_e) => {
        highlightCheck(each_e)
    })
}