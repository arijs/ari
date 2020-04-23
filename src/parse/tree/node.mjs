import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';

export default function fnParseNode(elementHandler) {
	return parseNode;
	function parseNode(name, attrs, children, elAdapter, ctxParse, ctx, node, trPlugin) {
		var handler;
		if (elementHandler) {
			handler = elementHandler.get({name, attrs, children, elAdapter, ctxParse, ctx, node});
		}
		var parseChildren = handler && handler.parseChildren || treeRenderPlugin;
		var parseElement = handler && handler.parseElement;
		children = parseChildren(node, elAdapter, ctx, trPlugin, null, true, ctxParse);
		children = elAdapter.childrenGet(children);
		node = { name, attrs, children, node, handler };
		return parseElement instanceof Function
			? parseElement(node, ctxParse, ctx, trPlugin)
			: node;
	}
}
