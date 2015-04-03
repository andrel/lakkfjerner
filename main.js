var ext = function (chrome, _) {
    // Register listeners.
    chrome.cookies.onChanged.addListener(filterCookies);
    chrome.runtime.onStartup.addListener(removeCookiesOnce);
    chrome.tabs.onUpdated.addListener(tabUpdated);

    function tabUpdated(tabId, changeinfo, tab) {
        var urlRegex = /^https?:\/\/(?:[^\.]+\.)?aftenposten\.no/;
        if (tab.url && tab.id) {
            if (urlRegex.test(tab.url)) {
                chrome.pageAction.show(tabId);
            }
        }
    }

    function filterCookies(changeinfo) {
        var cookie = changeinfo.cookie;
        var cause = changeinfo.cause;
        var cookie_removed = changeinfo.removed;

        if (!(cause === 'evicted' || cause === 'expired')) {
            attemptRemove(cookie);
        }
    }

    function removeCookiesOnce() {
        chrome.cookies.getAll({domain: 'aftenposten.no'}, function (cookies) {
            _.forEach(cookies, attemptRemove);
        });
    }

    function attemptRemove(cookie) {
        if (/^VPW_Quota*/.test(cookie.name)) {
            var toRemove = {
                url: "http" + ((cookie.secure) ? 's' : '') + '://' + cookie.domain + cookie.path,
                name: cookie.name
            };
            chrome.cookies.remove(toRemove, function (details) {
                console.assert(details != null, 'Could not remove cookie');
                console.log('Blokkert kjeks! (' + details.storeId + ' / ' + details.name + ' / ' + details.url + ')');
            });
        }
    }
};

var Utils = (function () {

    var forEach = function (array, action) {
        for (var i = 0; i < array.length; i++) {
            action(array[i]);
        }
    };

    return {
        forEach: forEach
    }
})();

ext(chrome, Utils);
