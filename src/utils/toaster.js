import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

export const processingToast = makeToast("Currently processing the article", 100000, "white")

export const finishedProcessingToast = (cached) => {
    const fetchedFromCacheMsg = "We have preserved the cached results for this article and reapplied them, with hoverable sections offering detailed explanations."
    const fetchedFromServerMsg = "We've completed fact-checking the article, highlighting key points. Hover over these sections for explanations on our markings."
    
    return makeToast(cached ? fetchedFromCacheMsg : fetchedFromServerMsg, 1000, "#a4ff9c")
}

export const errorToast = (errorMsg) => {
    return makeToast(errorMsg, 4000, "#ff8080")
}

function makeToast(msg, duration, colour="white") {
    return Toastify({
        text: msg,
        position: "right",
        gravity: "bottom",
        style: {
            background: colour,
            color: "black",
            borderRadius: "6px",
            fontSize: "14px",
            lineHeight: "1.3",
            maxWidth: "30vw"
        },
        duration: duration
    })
}