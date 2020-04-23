
export default function renderElementDefault({node, elAdapter, renderAdapter}) {
	var out = renderAdapter.initName(elAdapter.nameGet(node));
	elAdapter.attrsEach(node, function(name, value, attr) {
		renderAdapter.attrsAdd(out, attr || {name: name, value: value});
	});
	renderAdapter.childrenSet(out, elAdapter.childrenGet(node));
	return out;
}
