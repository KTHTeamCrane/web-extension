/**
 * Highlights the text of the fact checks in the page
 * @param {{label: string, excerpt: string, reason: string, sources: string[]}[]} checks
 * List of fact checks
 */
function highlightFactChecks(checks) {
    for (const check of checks) {
        // just a default color in case the label is not recognized
        let highlightColor = "#ccc";

        switch (check.label) {
            case "TRUE":
                highlightColor = "#92d4b7";
                break;
            case "FALSE":
                highlightColor = "#D66853";
                break;
            case "PARTIAL":
                highlightColor = "#F09D51";
                break;
        }

        highlightText(check.excerpt, highlightColor);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    chrome.runtime.sendMessage({ query: "getCurrentTabHtml" }, async (msgResponse) => {
        if (!msgResponse) {
            console.error('Error: No response received');
            return;
        }

        if (!msgResponse.html) {
            console.error('Error:', msgResponse.error);
            return;
        }

        console.log('URL:', msgResponse.url);
        console.log('HTML:', msgResponse.html);
        highlightFactChecks(msgResponse.checks);
    });
});

function highlightText(targetText, color) {
    const recursivelyHighlightText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent;
            const matchIndex = textContent.indexOf(targetText);
            if (matchIndex >= 0) {
                const beforeMatch = document.createTextNode(textContent.substring(0, matchIndex));
                const matchText = document.createElement('span');
                const divHighlightWrapper = document.createElement("div");
                const divTooltipContainer = document.createElement("div")
                const divTooltipBackground = document.createElement("div")
                const divTooltipHeader = document.createElement("div")
                const divHighlightedText = document.createElement("div")

                divHighlightWrapper.classList.add("inline")
                divHighlightWrapper.classList.add("relative")
                divHighlightWrapper.classList.add("cursor-pointer")
                divHighlightWrapper.id = "highlight-wrapper"

                divTooltipContainer.classList.add("absolute")
                divTooltipContainer.classList.add("bottom-100")
                divTooltipContainer.classList.add("left-0")
                divTooltipContainer.classList.add("w-full")
                divTooltipContainer.classList.add("grid")
                divTooltipContainer.classList.add("place-content-center")

                divTooltipBackground.classList.add("rounded-md")
                divTooltipBackground.classList.add("w-400")
                divTooltipBackground.classList.add("tooltip-shadow")
                divTooltipBackground.classList.add("bg-white")

                divTooltipBackground.innerHTML = "tooltip"

                divHighlightedText.style.backgroundColor = color
                divHighlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));

                divTooltipContainer.appendChild(divTooltipBackground)
                divHighlightWrapper.appendChild(divHighlightedText)
                divHighlightWrapper.appendChild(divTooltipContainer)
                matchText.appendChild(divHighlightWrapper)


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

function addTooltip(spanTag) {
    let divTooltipWrapper = document.createElement("div")
    divTooltipWrapper.classList.add([""])
}
