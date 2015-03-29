chrome = {
    cookies: {
	onChanged: {
	    addListener: function(listener) {}
	}
    },
    runtime: {
	onStartup: {
	    addListener: function(listener) {}
	}
    }
};

describe('plugin is started', function() {
    beforeEach(function() {
	spyOn(chrome.cookies.onChanged, 'addListener');
	spyOn(chrome.runtime.onStartup, 'addListener');
	ext(chrome, Utils);
    });
    it('adds cookies listener', function() {
	expect(chrome.cookies.onChanged.addListener).toHaveBeenCalled();
    });
    it('adds startup listener', function() {
	expect(chrome.runtime.onStartup.addListener).toHaveBeenCalled();
    });
    it('foos', function() {
	expect(ext).toBeDefined();
	ext(chrome, Utils);
    });
});