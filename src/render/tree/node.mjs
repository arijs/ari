import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';

export function renderElementDefault(node, elAdapter, renderAdapter) {
	var out = renderAdapter.initName(elAdapter.nameGet(node));
	elAdapter.attrsEach(node, function(name, value, attr) {
		renderAdapter.attrsAdd(out, attr || {name: name, value: value});
	});
	renderAdapter.childrenSet(out, elAdapter.childrenGet(node));
	return out;
}

export function renderNode(node, elAdapter, renderAdapter, ctxRender, ctx, pluginRender) {
	var handler = node.handler;
	var renderElement = handler && handler.renderElement || renderElementDefault;
	var renderChildren = handler && handler.renderChildren || treeRenderPlugin;
	var outTree = renderChildren(node, elAdapter, ctx, pluginRender, renderAdapter, true, ctxRender);
	elAdapter.childrenSet(node, renderAdapter.childrenGet(outTree));
	return renderElement(node, elAdapter, renderAdapter, ctxRender, ctx);
}

export default renderNode;
