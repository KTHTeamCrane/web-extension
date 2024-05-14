import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

export const returnedFromCache = Toastify({
    text: "We had cached the results for this article and have reapplied them for this article. Hover over these sections for explanations on our markings.",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 10000
})

export const processingToast = Toastify({
    text: "We've detected an article and are detecting if the article makes truthful claims",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 10000
})

export const finishedProcessingToast = Toastify({
    text: "We've completed fact-checking the article, highlighting key points. Hover over these sections for explanations on our markings.",
    position: "right",
    gravity: "bottom",
    style: {
        background: "white",
        color: "black",
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "1.3",
        maxWidth: "30vw"
    },
    duration: 3000
})

export const errorToast = (errorMsg) => {
    return Toastify({
        text: errorMsg,
        position: "right",
        gravity: "bottom",
        style: {
            background: "white",
            color: "black",
            borderRadius: "6px",
            fontSize: "14px",
            lineHeight: "1.3",
            maxWidth: "30vw"
        },
        duration: 3000
    })
}