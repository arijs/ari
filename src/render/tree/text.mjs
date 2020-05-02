import {printfParse} from '@arijs/frontend/src/printf';

export function renderTextNode(node, elAdapter, renderAdapter, ctxRender) {
	var hop = Object.prototype.hasOwnProperty;
	if (hop.call(node, 'key')) {
		var {key, mod, params} = node;
		var out = ctxRender.getValue(key, mod, params, function(update) {
			renderAdapter.textValueSet(out, update);
		});
		return renderAdapter.textNode(out);
	} else {
		return renderAdapter.textNode(elAdapter.textValueGet(node));
	}
}

export default function renderText({node, elAdapter, renderAdapter, ctxRender}) {
	var nodes = printfParse(elAdapter.textValueGet(node));
	var c = nodes.length;
	for (var i = 0; i < c; i++) {
		nodes[i] = renderTextNode(nodes[i], elAdapter, renderAdapter, ctxRender);
	}
	return nodes;
}
