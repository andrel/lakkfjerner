define(['app'], function(App) {
    describe('app', function() {
        var app, chrome, utils;
        beforeEach(function() {
            // Mock the parts of chrome API that we use.
            chrome = {
                cookies: {
                    remove: jasmine.createSpy(),
                    onChanged: {
                        addListener: jasmine.createSpy()
                    },
                    getAll: jasmine.createSpy()
                },
                runtime: {
                    onStartup: {
                        addListener: jasmine.createSpy()
                    }
                },
                tabs: {
                    onUpdated: {
                        addListener: jasmine.createSpy()
                    }
                }
            };
            utils = {
                forEach: jasmine.createSpy()
            };
            app = new App(utils, chrome);
        });
        it('is defined', function () {
            expect(App).toBeDefined();
        });
        it('registers with: chrome.runtime.onStartup', function() {
            expect(chrome.runtime.onStartup.addListener).toHaveBeenCalledWith(app.removeCookiesOnce);
        });
        it('registers with: chrome.tabs.onUpdated', function() {
            expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalledWith(app.tabUpdated);
        });
        it('registers with: chrome.cookies.onChanged', function() {
            expect(chrome.cookies.onChanged.addListener).toHaveBeenCalledWith(app.filterCookies);
        });

        describe('will filter: ', function () {
            var changeinfo;
            beforeEach(function () {
                changeinfo = {
                    cookie: {
                        name: 'VPW_Quota1234',
                        secure: false,
                        domain: 'aftenposten.no',
                        path: '/'
                    },
                    cause: {},
                    removed: false
                };
            });
            it('cookie is removed', function() {
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).toHaveBeenCalledWith({ url : 'http://aftenposten.no/', name : 'VPW_Quota1234' }, jasmine.any(Function));
            });
            it('secure cookie is removed', function() {
                changeinfo.cookie.secure = true;
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).toHaveBeenCalledWith({ url : 'https://aftenposten.no/', name : 'VPW_Quota1234' }, jasmine.any(Function));
            });
            it('other domain are left alone', function() {
                changeinfo.cookie.domain = 'example.com';
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).not.toHaveBeenCalled();
            });
            it('other cookies are left alone', function() {
                changeinfo.cookie.name = 'LegitCookieName';
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).not.toHaveBeenCalled();
            });
            it('evicted cookies are left alone', function() {
                changeinfo.cause = 'evicted';
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).not.toHaveBeenCalled();
            });
            it('expired cookies are left alone', function() {
                changeinfo.cause = 'expired';
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).not.toHaveBeenCalled();
            });
            it('does not remove cookies that are already being removed', function () {
                changeinfo.removed = true;
                app.filterCookies(changeinfo);
                expect(chrome.cookies.remove).not.toHaveBeenCalled();
            });
        });

        describe('will filter cookies on startup', function() {
            var cookies;
            beforeEach(function() {
                chrome.cookies.getAll = function(criteria_, callback_) {
                    callback_(cookies);
                };
                cookies = [{
                    name: 'VPW_Quota1234',
                        secure: false,
                        domain: 'aftenposten.no',
                        path: '/'
                }];
                app.removeCookiesOnce();
            });
            it('should attempt to remove cookies', function() {
                expect(chrome.cookies.remove).toHaveBeenCalled();
            });
        });
    });
});
