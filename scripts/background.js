// TODO: Move all of this to page_filter.js as an ES6 module
// TODO: fetch from some sort of CDN server
// >cdn maybe overkill? We can just store this in a separate JSON
// and serve it ourselves. Load it with a fetch request.
const NEWS_SOURCE_WHITELIST = [
    "https://edition.cnn.com",
    "https://www.nytimes.com",
    "https://www.bbc.com/news",
    "https://www.washingtonpost.com",
    "https://www.theguardian.com",
    "https://www.nbcnews.com",
    "https://www.abcnews.go.com",
    "https://www.cbsnews.com",
    "https://www.foxnews.com",
    "https://www.msnbc.com",
    "https://www.usatoday.com",
    "https://www.bloomberg.com",
    "https://www.wsj.com",
    "https://www.npr.org",
    "https://www.reuters.com",
    "https://www.apnews.com",
    "https://www.aljazeera.com",
    "https://www.cnbc.com",
    "https://www.news.yahoo.com",
    "https://www.forbes.com",
    "https://www.time.com",
    "https://www.theatlantic.com",
    "https://www.newsweek.com",
    "https://www.economist.com",
    "https://www.politico.com",
    "https://www.huffpost.com",
    "https://www.salon.com",
    "https://www.slate.com",
    "https://www.thehill.com",
    "https://www.axios.com",
    "https://www.ft.com",
    "https://www.usnews.com",
    "https://www.motherjones.com",
    "https://www.newyorker.com",
    "https://www.vox.com",
    "https://www.dailybeast.com",
    "https://www.rollcall.com",
    "https://www.sciencemag.org/news",
    "https://www.technologyreview.com",
    "https://www.nature.com/news",
    "https://www.sciencenews.org",
    "https://www.livescience.com",
    "https://www.goodnewsnetwork.org",
    "https://www.oann.com",
    "https://www.newsmax.com",
    "https://www.propublica.org",
    "https://www.pbs.org/newshour",
    "https://www.theintercept.com",
    "https://www.firstpost.com",
    "https://www.indiatoday.in",
    "https://www.thehindu.com",
    "https://www.indianexpress.com",
    "https://www.smh.com.au",
    "https://www.theage.com.au",
    "https://www.theglobeandmail.com",
    "https://www.nationalpost.com",
    "https://www.ctvnews.ca",
    "https://www.cbc.ca/news",
    "https://www.globalnews.ca",
    "https://www.dw.com",
    "https://www.france24.com",
    "https://www.lemonde.fr",
    "https://www.liberation.fr",
    "https://www.rfi.fr",
    "https://www.spiegel.de",
    "https://www.faz.net",
    "https://www.sueddeutsche.de",
    "https://www.zdf.de",
    "https://www.elmundo.es",
    "https://www.elpais.com",
    "https://www.lavanguardia.com",
    "https://www.ilsole24ore.com",
    "https://www.corriere.it",
    "https://www.repubblica.it",
    "https://www.nhk.or.jp",
    "https://www.asahi.com",
    "https://www.japantimes.co.jp",
    "https://www.yomiuri.co.jp",
    "https://www.koreaherald.com",
    "https://www.chinadaily.com.cn",
    "https://www.scmp.com",
    "https://www.timesofindia.com",
    "https://www.sundaytimes.lk",
    "https://www.straitstimes.com",
    "https://www.channelnewsasia.com",
    "https://www.news.com.au",
    "https://www.nzherald.co.nz",
    "https://www.afr.com",
    "https://www.jpost.com",
    "https://www.haaretz.com",
    "https://www.timesofisrael.com",
    "https://www.rt.com",
    "https://www.sputniknews.com",
    "https://www.pravda.ru",
    "https://www.mexiconewsdaily.com",
    "https://www.brazilian.report",
    "https://www.telesurtv.net", "https://www.latimes.com",
    "https://www.chicagotribune.com",
    "https://www.startribune.com",
    "https://www.denverpost.com",
    "https://www.philly.com",
    "https://www.sfchronicle.com",
    "https://www.boston.com",
    "https://www.dallasnews.com",
    "https://www.miamiherald.com",
    "https://www.seattletimes.com",
    "https://www.azcentral.com",
    "https://www.tampabay.com",
    "https://www.oregonlive.com",
    "https://www.freep.com",
    "https://www.ajc.com",
    "https://www.twincities.com",
    "https://www.sandiegouniontribune.com",
    "https://www.baltimoresun.com",
    "https://www.cleveland.com",
    "https://www.kansascity.com",
    "https://www.star-telegram.com",
    "https://www.sacbee.com",
    "https://www.orlandosentinel.com",
    "https://www.charlotteobserver.com",
    "https://www.newsday.com",
    "https://www.stltoday.com",
    "https://www.dispatch.com",
    "https://www.reviewjournal.com",
    "https://www.nydailynews.com",
    "https://www.tennessean.com",
    "https://www.detroitnews.com",
    "https://www.oklahoman.com",
    "https://www.post-gazette.com",
    "https://www.jsonline.com",
    "https://www.newsobserver.com",
    "https://www.indystar.com",
    "https://www.richmond.com",
    "https://www.timesunion.com",
    "https://www.nj.com",
    "https://www.sltrib.com",
    "https://www.al.com",
    "https://www.providencejournal.com",
    "https://www.hartfordcourant.com",
    "https://www.omaha.com",
    "https://www.thestate.com",
    "https://www.inquirer.com",
    "https://www.dailyherald.com",
    "https://www.pressherald.com",
    "https://www.theadvocate.com",
    "https://www.courant.com",
    "https://www.statesman.com",
    "https://www.kentucky.com",
    "https://www.abqjournal.com",
    "https://www.roanoke.com",
    "https://www.pilotonline.com",
    "https://www.argusleader.com",
    "https://www.boisestatepublicradio.org",
    "https://www.kut.org",
    "https://www.wbur.org",
    "https://www.wnyc.org",
    "https://www.kqed.org",
    "https://www.wbez.org",
    "https://www.kpbs.org",
    "https://www.wunc.org",
    "https://www.kpcc.org",
    "https://www.capradio.org",
    "https://www.wuwm.com",
    "https://www.vpr.org",
    "https://www.nhpr.org",
    "https://www.opb.org",
    "https://www.wgbh.org",
    "https://www.wfyi.org",
    "https://www.wesa.fm",
    "https://www.kuow.org",
    "https://www.wmfe.org",
    "https://www.wlrn.org",
    "https://www.tpr.org",
    "https://www.spokanepublicradio.org",
    "https://www.wshu.org",
    "https://www.mtpr.org",
    "https://www.wvpe.org",
    "https://www.mprnews.org",
    "https://www.krcb.org",
    "https://www.wvik.org",
    "https://www.wdet.org",
    "https://www.kplu.org",
    "https://www.wjct.org",
    "https://www.kuer.org",
    "https://www.wdiy.org",
    "https://www.ksut.org",
    "https://www.krcc.org",
    "https://www.krvs.org",
    "https://www.kuaf.com",
    "https://www.wppb.org",
    "https://www.wutc.org",
    "https://www.wuot.org",
    "https://www.kbia.org",
    "https://www.wfiu.org",
    "https://www.wual.org",
    "https://www.theverge.com",
    "https://www.engadget.com",
    "https://www.techcrunch.com",
    "https://www.wired.com",
    "https://www.gizmodo.com",
    "https://www.cnet.com",
    "https://www.mashable.com",
    "https://www.digitaltrends.com",
    "https://www.venturebeat.com",
    "https://www.zdnet.com",
    "https://www.arstechnica.com",
    "https://www.tomsguide.com",
    "https://www.pcmag.com",
    "https://www.techradar.com",
    "https://www.androidauthority.com",
    "https://www.macrumors.com",
    "https://www.9to5mac.com",
    "https://www.anandtech.com",
    "https://www.theinquirer.net",
    "https://www.slashgear.com",
    "https://www.kotaku.com",
    "https://www.ign.com",
    "https://www.gamespot.com",
    "https://www.polygon.com",
    "https://www.gameinformer.com",
    "https://www.eurogamer.net",
    "https://www.giantbomb.com",
    "https://www.destructoid.com",
    "https://www.gamefaqs.com",
    "https://www.twinfinite.net",
    "https://www.gamezone.com",
    "https://toucharcade.com",
    "https://www.gamasutra.com",
    "https://www.vg247.com",
    "https://www.gog.com",
    "https://www.steamcommunity.com",
    "https://www.metacritic.com",
    "https://www.imdb.com",
    "https://www.rottentomatoes.com",
    "https://www.boxofficemojo.com",
    "https://www.variety.com",
    "https://www.hollywoodreporter.com",
    "https://www.deadline.com",
    "https://www.screendaily.com",
    "https://www.filmcompanion.in",
    "https://www.indiewire.com",
    "https://www.filmschoolrejects.com",
    "https://www.cinemaBlend.com",
    "https://www.letterboxd.com",
    "https://www.fandango.com",
    "https://www.amctheatres.com",
    "https://www.vogue.com",
    "https://www.elle.com",
    "https://www.gq.com",
    "https://www.cosmopolitan.com",
    "https://www.glamour.com",
    "https://www.harpersbazaar.com",
    "https://www.marieclaire.com",
    "https://www.esquire.com",
    "https://www.vanityfair.com",
    "https://www.instyle.com",
    "https://www.teen.com",
    "https://www.vox.com",
    "https://www.slate.com",
    "https://www.theatlantic.com",
    "https://www.newrepublic.com",
    "https://www.talkingpointsmemo.com",
    "https://www.dailykos.com",
    "https://www.buzzfeed.com",
    "https://www.upworthy.com",
    "https://www.cracked.com",
    "https://www.medium.com",
    "https://www.fivethirtyeight.com",
    "https://www.quartz.com",
    "https://www.vice.com",
    "https://www.theonion.com"
];

/**
 * 
 * @param {string} url URL of the page
 * @returns True if the URL is in the news source whitelist
 */
function isURLNewsSource(url) {
    return NEWS_SOURCE_WHITELIST.some(newsSource => url.startsWith(newsSource));
}

/**
 * 
 * @param {string} html HTML content of the page
 * @returns True if the HTML contains an article tag
 */
function isHTMLArticle(html) {
    return html.includes("<article>") || html.includes("\"article:tag\"");
}

async function setTimeoutAsync(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// const API_URL = "https://api-gateway-slixmjmf2a-ez.a.run.app";
const API_URL = "http://localhost:8000";

/**
 * Fact check an article from the page HTML.
 * @param {string} html HTML of the article to be fact-checked
 * @returns {Promise<{label: string, excerpt: string, reason: string, sources: string[]}[]>}
 * Returns a promise that resolves to an array of fact-check results.
 */
async function fetchHTMLFactCheck(html) {
    const checkReq = await fetch(`${API_URL}/api/article/extract-and-fact-check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ article_html: html }),
    });

    if (checkReq.status !== 200) {
        console.error('Error:', checkReq.statusText);
        return;
    }

    return checkReq.json();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.query !== "getCurrentTabHtml") return;

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (!tabs[0]) {
            sendResponse({ error: "No active tab" });
            return;
        }

        if (!isURLNewsSource(tabs[0].url)) {
            sendResponse({ error: "URL not in whitelist" });
            return;
        }

        await setTimeoutAsync(1000);

        try {
            const htmlReq = await fetch(tabs[0].url);
            const html = await htmlReq.text();

            // TODO: Remove this to do CNN or something. Here to not check
            // root pages for now.
            if (!isHTMLArticle(html)) {
                sendResponse({ error: "HTML is not an article" });
                return;
            }

            const checks = await fetchHTMLFactCheck(html);

            sendResponse({ html: html, url: tabs[0].url, checks: checks });
        } catch (error) {
            sendResponse({ error: error.message });
        }
    });
    return true;
});

