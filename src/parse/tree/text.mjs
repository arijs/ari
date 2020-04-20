import {printfParse} from '@arijs/frontend/src/printf';

export default function parseText(str, elAdapter) {
	var nodes = printfParse(str);
	var c = nodes.length;
	for (var i = 0; i < c; i++) {
		var inputNode = nodes[i];
		var outputNode = elAdapter.textNode(inputNode.text);
		if (inputNode.key) {
			outputNode.key = inputNode.key;
			outputNode.mod = inputNode.mod;
			outputNode.params = inputNode.params;
		}
		nodes[i] = outputNode;
	}
	return nodes;
}
