// Chrome complains about App from app.js not being available. We get around this by delaying in main.js.
// I suspect this is a horribly dirty hack.
setTimeout(function () {
    new App({}, chrome);
}, 500);
