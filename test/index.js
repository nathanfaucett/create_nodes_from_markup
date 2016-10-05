var tape = require("tape"),
    createNodesFromMarkup = require("..");


tape("getMarkupWrap(nodeName : String) should create DOM nodes from markup", function(assert) {
    var nodes = createNodesFromMarkup("<div></div>"),
        div = nodes[0];

    assert.equal(nodes.length, 1);
    assert.equal(div.tagName, "DIV");

    assert.end();
});
