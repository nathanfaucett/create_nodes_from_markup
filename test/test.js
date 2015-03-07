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

    it("should create DOM nodes from markup", function() {
        var nodes = createNodesFromMarkup("<div></div>"),
            div = nodes[0];

        assert.equal(nodes.length, 1);
        assert.equal(div.tagName, "DIV");
    });
});
