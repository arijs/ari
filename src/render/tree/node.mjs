import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';
import renderElementDefault from './element/default';

export default function renderNode(node, elAdapter, renderAdapter, ctxRender, ctx, pluginRender) {
	var handler = node.handler;
	var renderElement = handler && handler.renderElement || renderElementDefault;
	var renderChildren = handler && handler.renderChildren || treeRenderPlugin;
	var outTree = renderChildren(node, elAdapter, ctx, pluginRender, renderAdapter, true, ctxRender);
	elAdapter.childrenSet(node, renderAdapter.childrenGet(outTree));
	return renderElement({node, elAdapter, renderAdapter, ctxRender, ctx});
}
