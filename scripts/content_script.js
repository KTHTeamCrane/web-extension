/**
 * Highlights the text of the fact checks in the page
 * @param {{LABEL: string, EXCERPT: string, REASON: string, SOURCES: string[]}[]} checks
 * List of fact checks
 */
function highlightFactChecks(checks) {
    for (const check of checks) {
        console.log(check)
        // just a default color in case the label is not recognized
        let highlightColor = "#ccc";

        switch (check.LABEL) {
            case "True":
                highlightColor = "#92d4b7";
                break;
            case "False":
                highlightColor = "#D66853";
                break;
            case "Partially true":
                highlightColor = "#F09D51";
                break;
        }

        highlightText(check, highlightColor);
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

function highlightText(check, color) {
    const targetText = check.EXCERPT

    const recursivelyHighlightText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent;
            const matchIndex = textContent.indexOf(targetText);
            if (matchIndex >= 0) {
                const beforeMatch = document.createTextNode(textContent.substring(0, matchIndex));
                const matchText = document.createElement('span');
                const container = document.createElement("div");
                container.classList.add("ltms-container")


                const highlightedText = document.createElement("div")
                highlightedText.classList.add("ltms-highlighted-text")
                highlightedText.style.backgroundColor = color


                highlightedText.textContent = textContent.substring(matchIndex, matchIndex + targetText.length);
                const afterMatch = document.createTextNode(textContent.substring(matchIndex + targetText.length));

                container.appendChild(highlightedText)

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
 * Adds a tooltip around a div tag that activate on mouse enter of divTag
 * @param divTag 
 */
function addTooltip(divTag, data) {
    const tooltipWrapper = document.createElement("div")
    tooltipWrapper.id = "ltms-tt-wrapper"

    const tooltipBg = document.createElement("div")

    const tooltipHeader = document.createElement("div")
    tooltipHeader.innerHTML = "LitmusNews"

    const tooltipReason = document.createElement("div")
    tooltipReason.innerHTML = data.EXPLANATION

    const tooltipSourcesLabel = document.createElement("div")
    tooltipSourcesLabel.innerHTML = "Sources"

    const tooltipSourcesList = document.createElement("div")

    data.SOURCES.forEach((each_source) => {
        const sourceDiv = document.createElement("div")
        sourceDiv.innerHTML = each_source
        sourceDiv.classList.add("ltms-tt-src_item")
        tooltipSourcesList.appendChild(sourceDiv)
    })


    // Add CSS classes
    tooltipWrapper.classList.add("ltms-tt-wrapper")
    tooltipBg.classList.add("ltms-tt-bg")
    tooltipHeader.classList.add("ltms-tt-header")
    tooltipReason.classList.add("ltm-tt-reason")
    tooltipSourcesLabel.classList.add("ltm-tt-src_lbl")
    tooltipSourcesList.classList.add("ltm-tt-src_list")

    // Append all children
    tooltipBg.appendChild(tooltipHeader)
    tooltipBg.appendChild(tooltipReason)
    tooltipBg.appendChild(tooltipSourcesLabel)
    tooltipBg.appendChild(tooltipSourcesList)

    tooltipWrapper.appendChild(tooltipBg)
    divTag.appendChild(tooltipWrapper)
}
