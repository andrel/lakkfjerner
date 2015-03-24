(function() {
var cookieApi = chrome.cookies;
var tabsApi = chrome.tabs;

cookieApi.onChanged.addListener(filterCookies);
chrome.runtime.onStartup.addListener(removeCookiesOnce);


function filterCookies(changeinfo) {
  var cookie = changeinfo.cookie;
  var cause = changeinfo.cause;
  var cookie_removed = changeinfo.removed;

  if (cause === 'evicted' || cause === 'expired') {
    return;
  }

  attemptRemove(cookie);
}

function removeCookiesOnce() {
  cookieApi.getAll({domain: 'aftenposten.no'}, function(cookies) {
    forEach(cookies, attemptRemove);
  });
}

function attemptRemove(cookie) {
  if (/^VPW_Quota*/.test(cookie.name)) {

    var toRemove = {
      url: "http" + ((cookie.secure) ? 's' : '') + '://' + cookie.domain + cookie.path,
      name: cookie.name
  	};
    cookieApi.remove(toRemove, function(details) {
      console.assert(details != null, 'Could not remove cookie');
      //console.log('Blokkert kjeks! (' + details.storeId + ' / ' + details.name + ' / ' + details.url + ')');
    });
  }
}

function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}
})()
