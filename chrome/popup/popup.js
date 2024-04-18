const EXPRESS_API_DOMAIN = "http://127.0.0.1:8000"

const debugTextField = document.getElementById("big-red-button__debug-text")


document.getElementById("big-red-button__button").onclick = async () => {
    console.log("Click")
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    let expressServerRequestUrl = EXPRESS_API_DOMAIN + "/article/fake?article=" + tab.url
    let expressResponse = await fetch(expressServerRequestUrl, {method: "GET"})
    let html = await expressResponse.text()
    debugTextField.innerHTML = html
}
