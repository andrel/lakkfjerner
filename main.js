(function() {
var cookieApi = chrome.cookies;
var tabsApi = chrome.tabs;

cookieApi.onChanged.addListener(function(changeinfo) {
  var cookie = changeinfo.cookie;
  var cause = changeinfo.cause;
  var cookie_removed = changeinfo.removed;

  if (cause === 'evicted' || cause === 'expired') {
    return;
  }

  if (/^VPW_Quota*/.test(cookie.name)) {
		tabsApi.getSelected(null, function(tab) {
			var toRemove = {
			  url: "http" + ((cookie.secure) ? "s" : "") + "://" + cookie.domain + cookie.path,
			  name: cookie.name
			};
			cookieApi.remove(toRemove);
			console.log("Blokkert kjeks! (" + cookie.name + " / " + toRemove.url + ')');
			return;
		});
  }
});

chrome.runtime.onStartup.addListener(removeCookiesOnce);

var removeCookiesOnce = function() {
	console.log('On startup - removing cookies once');
  var details = {
    domain: 'aftenposten.no'
  }
  cookieApi.getAll(details, function(cookies) {
    for (var i = 0; i < cookies.length;  i++) {
      if (/^VPW_Quota*/.test(cookies[i].name)) {
        var cookie = cookies[i];
        var toRemove = {
          url: "http" + ((cookie.secure) ? "s" : "") + "://" + cookie.domain + cookie.path,
          name: cookie.name
        };
        console.log(toRemove);
        cookieApi.remove(toRemove);
      }
    }
  })
}

})()
