import { tooltip } from "./tooltip";

class Highlighting {
    highlightSingleCheck(check) {
        const targetText = check.EXCERPT

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
                    highlightedText.classList.add(`ltms-highlighted-${check.LABEL.toLowerCase()}`)
    
                    
                    highlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                    const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));
    
                    container.appendChild(highlightedText)
    
                    if (check.LABEL.toLowerCase() === "pending") tooltip.addPendingTooltip(container, check)
                    else tooltip.addTooltip(container, check)
    
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

    applyPageHighlights(checks) {
        checks.forEach((each_check) => {
            this.highlightSingleCheck(each_check)
        })
    }
}

export const highlighting = new Highlighting()

/**
 * Takes a `check` object and searches the entire page to find the `excerpt`, then highlights 
 * then highlights that excerpt.
 * @param {{LABEL: string, EXCERPT: string, EXPLANATION: string, sources: string[]}} check 
 * @deprecated
 */
export function highlightCheck(check) {
    const targetText = check.EXCERPT

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
                highlightedText.classList.add(`ltms-highlighted-${check.LABEL.toLowerCase()}`)

                
                highlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));

                container.appendChild(highlightedText)

                if (check.LABEL.toLowerCase() === "pending") tooltip.addPendingTooltip(container, check)
                else tooltip.addTooltip(container, check)

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
 * Takes in a list of "fact-checked" `claims` and applies highlighting to all the claims.
 * 
 * Highlighting works only if the provided claim exists within a single HTML element.
 * @param {{LABEL: string, EXCERPT: string, EXPLANATION: string, SOURCES: string[]}[]} claims 
 * @deprecated
 */
export function applyPageHighlights(claims) {
    claims.forEach((each_e) => {
        highlightCheck(each_e)
    })
}
