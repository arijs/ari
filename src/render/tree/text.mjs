
export default function renderText(str, elAdapter, renderAdapter, ctxRender) {
	var hop = Object.prototype.hasOwnProperty;
	if (hop.call(str, 'key')) {
		var out = ctxRender.getValue(str.key, str.mod, str.params, function(update) {
			renderAdapter.textValueSet(out, update);
		});
		return renderAdapter.textNode(out);
	} else {
		return renderAdapter.textNode(elAdapter.textValueGet(str));
	}
}
