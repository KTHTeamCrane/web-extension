export async function returnCachedResult(url) {
    let cache = await getWebsiteCache()
    console.log("searching cache", cache)
    for (let each_cache in cache) {
        console.log(each_cache.url, url, each_cache.url === url)
        if (each_cache.url === url) {
            console.log("found")
            return {
                found: true,
                cachedResult: each_cache.cachedResult
            }
        }
    }
    console.log("found none")
    return {
        found: false
    }
}

export async function getWebsiteCache() {
    console.log("Getting storage cache")
    const storageOutput = await chrome.storage.local.get(["websiteCache"])
    const websiteCache = await storageOutput.websiteCache
    console.log("Loaded data from cache", storageOutput)
    return websiteCache
}

export async function addToWebsiteCache(nv, url) {
    console.log("Setting new value on the url")
    const currentCache = await getWebsiteCache()
    const newItem = { url, cachedResult: nv }
    console.log("Current cache", currentCache)
    currentCache.push(newItem)
    console.log("Adding to website", currentCache)
    chrome.storage.local.set( { websiteCache: currentCache })
}

export function setHighlightEnabled(nv) {
    chrome.storage.local.set({ highlightEnabled: nv })
}


/**
 * Checks if the `autoDetect` and `highlightEnabled` keys have been set. 
 * 
 * If it has not been, then the keys are initialised.
 */
export function initialiseStorage() {
    chrome.storage.local.get(["autoDetect"]).then((v) => {
        if (v.autoDetect == undefined) {
            console.log("Keys were not initialised")
            chrome.storage.local.set({ autoDetect: true }).then(() => {
                chrome.storage.local.set({ highlightEnabled: true })
            })
        } else console.log("Keys for popup toggles were indeed initialised")
    })

    chrome.storage.local.get(["websiteCache"]).then((v) => {
        if (v.websiteCache == undefined) {
            console.log("Website cache was not initialised")
            chrome.storage.local.set({ websiteCache: [] }).then(() => {
                console.log("Initialised website cache")
            })
        } else console.log("Website cache was indeed initialised")
    })
}


export function getItems(sendResponse) {
    console.log("handleStorageGetItems")
    chrome.storage.local.get("autoDetect").then((v1) => {
        chrome.storage.local.get("highlightEnabled").then((v2) => {
            console.log("states from background", v1.autoDetect, v2.highlightEnabled)
            sendResponse({
                stateAutoDetect: v1.autoDetect,
                stateHighlightEnabled: v2.highlightEnabled
            })
        })
    })
}

export function getStateAutoDetect() {
    return chrome.storage.local.get("autoDetect")
}

export function setStateAutoDetect(nv) {
    console.log("handleStorageSetAutoDetect")
    chrome.storage.local.set({ autoDetect: nv })
}