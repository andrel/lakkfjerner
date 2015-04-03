(function () {

    var root = this;

    var chrome_, _;

    var constructor = function App(utils, chrome) {
        chrome_ = chrome;
        _ = utils;

        var that = {};
        that.tabUpdated = tabUpdated;
        that.filterCookies = filterCookies;
        that.removeCookiesOnce = removeCookiesOnce;

        // Register listeners.
        chrome.cookies.onChanged.addListener(that.filterCookies);
        chrome.runtime.onStartup.addListener(that.removeCookiesOnce);
        chrome.tabs.onUpdated.addListener(that.tabUpdated);

        return that;
    };

    var tabUpdated = function (tabId, changeinfo, tab) {
        var urlRegex = /^https?:\/\/(?:[^\.]+\.)?aftenposten\.no/;
        if (tab.url && tab.id) {
            if (urlRegex.test(tab.url)) {
                chrome_.pageAction.show(tabId);
            }
        }
    };

    var filterCookies = function (changeinfo) {
        var cookie = changeinfo.cookie;
        var cause = changeinfo.cause;
        var cookie_removed = changeinfo.removed;

        if (cookie_removed) {
            return;
        }
        if (cause === 'evicted' || cause === 'expired') {
            return;
        } else {
            attemptRemove(cookie);
        }
    };

    var removeCookiesOnce = function () {
        chrome_.cookies.getAll({domain: 'aftenposten.no'}, function (cookies) {
            forEach(cookies, attemptRemove);
        });
    };

    function attemptRemove(cookie) {
        if (/^VPW_Quota*/.test(cookie.name)
            && /^aftenposten\.no/.test(cookie.domain)) {
            var toRemove = {
                url: "http" + ((cookie.secure) ? 's' : '') + '://' + cookie.domain + cookie.path,
                name: cookie.name
            };
            chrome_.cookies.remove(toRemove, function (details) {
                console.assert(details != null, 'Could not remove cookie');
                console.log('Blokkert kjeks! (' + details.storeId + ' / ' + details.name + ' / ' + details.url + ')');
            });
        }
    }

    function forEach(array, action) {
        for (var i = 0; i < array.length; i++) {
            action(array[i]);
        }
    }

    if (typeof define === 'function' && define.amd) {
        define('app', [], function() {
            return constructor;
        });
    }

    root.App = constructor;

})();
