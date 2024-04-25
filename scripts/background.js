chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.query === "getCurrentTabHtml") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                setTimeout(() => {
                    fetch(tabs[0].url)
                        .then(response => response.text())
                        .then(html => sendResponse({ html: html, url: tabs[0].url }))
                        .catch(error => sendResponse({ error: error.message }));
                }, 2500);
            } else {
                sendResponse({ error: "No active tab" });
            }
        });
        return true;
    }
});

