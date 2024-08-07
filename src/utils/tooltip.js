import tippy from "tippy.js"

/**
 * Returns the appropriate CSS class that changes colour on the LitmusNews text on the tooltip
 * @param {"TRUE" | "PARTIALLY TRUE" | "FALSE"} label
 * @returns {string}
 */
export function labelToClass(label) {
    switch (label) {
        case "TRUE":
            return "ltms-header-true";
        case "PARTIALLY TRUE":
            return "ltms-header-partially-true";
        case "FALSE":
            return "ltms-header-false";
        case "Pending":
            return "ltms-header-pending";
    }
}

/**
 * @param {HTMLElement} parent
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
* }} data 
*/
export function addTooltip(parent, data) {
    console.log("Adding tooltip")
    const bg = document.createElement("div")
    bg.classList.add("tippy-bg")

    const header = document.createElement("div")
    header.innerHTML = "LitmusNews"

    const reason = document.createElement("div")
    reason.innerHTML = data.EXPLANATION

    const sourceLabel = document.createElement("div")

    if (data.SOURCES.length > 0) {
        sourceLabel.innerHTML = "Sources"
    }

    const sourceList = document.createElement("div")

    data.SOURCES.forEach((each_source) => {
        let el;

        if (each_source.type === "UNKNOWN") {
            el = document.createElement("div")
            el.innerHTML = each_source.raw
        } else {
            el = document.createElement("a")
            el.innerHTML = each_source.source_publisher
            el.href = each_source.url
            el.target = "_blank"
        }

        el.classList.add("ltms-tt-src_item")
        sourceList.appendChild(el)
    })


    // Add CSS classes
    bg.classList.add("ltms-tt-bg")
    header.classList.add("ltms-tt-header")
    header.classList.add(labelToClass(data.LABEL))
    reason.classList.add("ltm-tt-reason")
    sourceLabel.classList.add("ltm-tt-src_lbl")
    sourceList.classList.add("ltm-tt-src_list")

    // Append all children
    bg.appendChild(header)
    bg.appendChild(reason)
    bg.appendChild(sourceLabel)
    bg.appendChild(sourceList)

    // parent.appendChild(bg)

    function onTippyMount(instance) {
        document.getElementById(`tippy-${instance.id}`).classList.add("inline")
    }

    return tippy(parent, {
        content: bg,
        interactive: true,
        trigger: 'click',
        delay: [100, -100],
        animation: 'fade'
    })
}

/**
 * 
 * @param {HTMLElement} parent 
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
* }[]} data 
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

    return tippy(parent, {
        content: bg,
        interactive: true,
        trigger: 'click'
    })
}

