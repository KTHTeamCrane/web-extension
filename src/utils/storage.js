/**
 * Checks the cache if the URL exists in cache, then returns cached results if they exist.
 * @param {string} url 
 */
export async function returnCachedResult(url) {
    let cache = await getWebsiteCache()
    console.log("cache from returnCachedResult  ", cache)
    console.log("searching cache", cache)
    for (let i = 0; i < cache.length; i++) {
        if (cache[i].url == url) {
            console.log("found", cache[i].cachedResult)
            return {
                found: true,
                cachedResult: cache[i].cachedResult
            }
        }
    }
    return {
        found: false
    }
}

/**
 * 
 * @returns All website caches from local storage.
 */
export async function getWebsiteCache() {
    const storageOutput = await chrome.storage.local.get(["websiteCache"])
    const websiteCache = await storageOutput.websiteCache
    return websiteCache
}

/**
 * 
 * @param {} nv 
 * @param {string} url 
 */
export async function addToWebsiteCache(nv, url) {
    const currentCache = await getWebsiteCache()
    const newItem = { url, cachedResult: nv }
    currentCache.push(newItem)
    chrome.storage.local.set( { websiteCache: currentCache })
}

/**
 * @param {boolean} nv 
 */
export function setHighlightEnabled(nv) {
    chrome.storage.local.set({ highlightEnabled: nv })
}


/**
 * Checks if the `autoDetect` and `highlightEnabled` keys have been set. 
 * 
 * If it has not been, then the keys are initialised.
 * 
 * Also checks if caching is initialised, and does initialisation if it hasn't been done so.
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


/**
 * @param sendResponse to send response to the content script
 */
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