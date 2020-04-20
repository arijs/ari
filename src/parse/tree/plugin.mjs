
export default function fnPluginParse(ctxParse, parseText, parseNode) {
	return pluginParse;
	function pluginParse(node, elAdapter, ctx) {
		if (elAdapter.isText(node)) {
			node = parseText(
				elAdapter.textValueGet(node),
				elAdapter,
				ctxParse,
				ctx,
				node,
				pluginParse
			);
		} else {
			var attrs = [];
			elAdapter.attrsEach(node, (name, value, attr) => {
				attrs.push({name, value, attr});
			});
			node = parseNode(
				elAdapter.nameGet(node),
				attrs,
				elAdapter.childrenGet(node),
				elAdapter,
				ctxParse,
				ctx,
				node,
				pluginParse
			);
		}
		return node;
	}
}
