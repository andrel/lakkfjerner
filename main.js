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

  if (cookie.name.indexOf('VPW_Quota') != -1) {
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
console.log('Extension loaded');
})()
