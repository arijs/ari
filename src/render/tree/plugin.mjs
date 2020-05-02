
export default function renderPlugin(node, elAdapter, ctx, renderAdapter) {
	const {ctxRender, renderText, renderNode} = ctx;
	if (elAdapter.isText(node)) {
		node = renderText({
			node,
			elAdapter,
			renderAdapter,
			ctxRender,
			ctx,
			trPlugin: renderPlugin,
		});
	} else {
		node = renderNode({
			node,
			elAdapter,
			renderAdapter,
			ctxRender,
			ctx,
			trPlugin: renderPlugin,
		});
	}
	return node;
}
