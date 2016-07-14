var arrayForEach = require("@nathanfaucett/array-for_each"),
    supports = require("@nathanfaucett/supports"),
    isArray = require("@nathanfaucett/is_array"),
    toArray = require("@nathanfaucett/to_array"),
    environment = require("@nathanfaucett/environment"),
    getMarkupWrap = require("@nathanfaucett/get_markup_wrap");


var dummyNode = supports.dom ? environment.document.createElement("div") : null,
    reNodeName = /^\s*<(\w+)/;


module.exports = createNodesFromMarkup;


function createNodesFromMarkup(markup, handleScript) {
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
            arrayForEach(createArrayFromMixed(scripts), handleScript);
        }

        nodes = createArrayFromMixed(node.childNodes);
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }

        return nodes;
    } else {
        throw new Error("createNodesFromMarkup(markup, handleScript) dummy not initialized");
    }
}

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
