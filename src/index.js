var forEach = require("for_each"),
    supports = require("supports"),
    isArray = require("is_array"),
    toArray = require("to_array"),
    environment = require("environment"),
    getMarkupWrap = require("get_markup_wrap");


var dummyNode = supports.dom ? environment.document.createElement("div") : null,
    reNodeName = /^\s*<(\w+)/;


function getNodeName(markup) {
    var nodeNameMatch = markup.match(reNodeName);
    return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

function hasArrayNature(object) {
    return (!!object &&
        (typeof(object) === "object" || typeof(object) === "function") &&
        ("length" in object) &&
        !("setInterval" in object) &&
        (typeof(object.nodeType) !== "number") &&
        (
            isArray(object) ||
            ("callee" in object) ||
            ("item" in object)
        )
    );
}

function createArrayFromMixed(object) {
    if (!hasArrayNature(object)) {
        return [object];
    } else if (isArray(object)) {
        return object.slice();
    } else {
        return toArray(object);
    }
}

module.exports = function createNodesFromMarkup(markup, handleScript) {
    var node = dummyNode,
        nodeName, wrap, wrapDepth, scripts, nodes;

    if (dummyNode) {
        nodeName = getNodeName(markup);
        wrap = nodeName && getMarkupWrap(nodeName);

        if (wrap) {
            node.innerHTML = wrap[1] + markup + wrap[2];

            wrapDepth = wrap[0];
            while (wrapDepth--) {
                node = node.lastChild;
            }
        } else {
            node.innerHTML = markup;
        }

        scripts = node.getElementsByTagName('script');
        if (scripts.length) {
            if (!handleScript) {
                throw new Error("createNodesFromMarkup(...): Unexpected <script> element rendered.");
            } else {

            }
            forEach(createArrayFromMixed(scripts), handleScript);
        }

        nodes = createArrayFromMixed(node.childNodes);
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }

        return nodes;
    } else {
        throw new Error("createNodesFromMarkup(markup, handleScript) dummy not initialized");
    }
};
