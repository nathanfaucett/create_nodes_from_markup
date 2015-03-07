var assert = require("assert"),
    Browser = require("zombie"),
    createNodesFromMarkup;


describe("getMarkupWrap(nodeName : String)", function() {
    before(function(done) {
        Browser.visit("http://localhost", function(e, browser) {
            global.window = browser.window;
            global.document = browser.window.document;
            createNodesFromMarkup = require("../src/index");
            done();
        });
    });

    it("should return null if nodeName should not be wraped array helper if needed", function() {
        var nodes = createNodesFromMarkup("<div></div>"),
            div = nodes[0];

        assert.equal(nodes.length, 1);
        assert.equal(div.tagName, "DIV");
    });
});
