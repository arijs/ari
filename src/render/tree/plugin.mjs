
export default function fnPluginRender(ctxRender, renderText, renderNode) {
	return pluginRender;
	function pluginRender(node, elAdapter, ctx, renderAdapter) {
		if (elAdapter.isText(node)) {
			node = renderText(
				node,
				elAdapter,
				renderAdapter,
				ctxRender,
				ctx,
				pluginRender
			);
		} else {
			node = renderNode(
				node,
				elAdapter,
				renderAdapter,
				ctxRender,
				ctx,
				pluginRender
			);
		}
		return node;
	}
}
