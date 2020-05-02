
export default function fnPluginParse(ctxParse, parseText, parseNode) {
	return pluginParse;
	function pluginParse(node, elAdapter, ctx) {
		if (elAdapter.isText(node)) {
			node = parseText({
				text: elAdapter.textValueGet(node),
				node,
				elAdapter,
				ctxParse,
				ctx,
				trPlugin: pluginParse
			});
		} else {
			// var attrs = [];
			// elAdapter.attrsEach(node, (name, value, attr) => {
			// 	attrs.push({name, value, attr});
			// });
			node = parseNode({
				// name: elAdapter.nameGet(node),
				// attrs,
				// children: elAdapter.childrenGet(node),
				node,
				elAdapter,
				ctxParse,
				ctx,
				trPlugin: pluginParse
			});
		}
		return node;
	}
}
