import tippy from "tippy.js"

export function addTooltip(parent, data) {
    const bg = document.createElement("div")
    bg.classList.add("tippy-bg")

    const header = document.createElement("div")
    header.innerHTML = "LitmusNews"

    const reason = document.createElement("div")
    reason.innerHTML = data.EXPLANATION

    const sourceLabel = document.createElement("div")
    sourceLabel.innerHTML = "Sources"

    const sourceList = document.createElement("div")

    data.SOURCES.forEach((each_source) => {
        const sourceDiv = document.createElement("div")
        sourceDiv.innerHTML = each_source
        sourceDiv.classList.add("ltms-tt-src_item")
        sourceList.appendChild(sourceDiv)
    })


    // Add CSS classes
    bg.classList.add("ltms-tt-bg")
    header.classList.add("ltms-tt-header")
    reason.classList.add("ltm-tt-reason")
    sourceLabel.classList.add("ltm-tt-src_lbl")
    sourceList.classList.add("ltm-tt-src_list")

    // Append all children
    bg.appendChild(header)
    bg.appendChild(reason)
    bg.appendChild(sourceLabel)
    bg.appendChild(sourceList)

    parent.appendChild(bg)

    tippy(parent, {
        "content": bg
    })
}

/**
 * 
 * @param {HTMLElement} parent 
 * @param {{LABEL: 'pending', EXCERPT: string, EXPLANATION: string, SOURCES: string[]}} data 
 */
export function addPendingTooltip(parent) {
    const bg = document.createElement("div")
    bg.classList.add("tippy-bg")

    const header = document.createElement("div")
    header.innerHTML = "LitmusNews"

    const spinner = document.createElement("div")
    const img = document.createElement("img")
    img.src = "https://www.svgrepo.com/show/315795/spinner.svg"

    const statusText = document.createElement("div")
    statusText.innerText = "We're verifying if the text you highlighted is factually correct."


    // Add CSS classes
    bg.classList.add("ltms-tt-bg")
    header.classList.add("ltms-tt-header")
    spinner.classList.add("ltms-tt-spinner-wrapper")
    img.classList.add("ltms-tt-spinner")
    statusText.classList.add("ltms-tt-status-text")

    // Append all children
    spinner.appendChild(img)
    bg.appendChild(header)
    bg.appendChild(statusText)
    bg.appendChild(spinner)

    parent.appendChild(bg)

    tippy(parent, {
        "content": bg
    })
}

