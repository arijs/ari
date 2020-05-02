import each from '@arijs/frontend/src/utils/for-each';
import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';

export default function fnParseNode(elementHandler, extraSave) {//, partialHandlers
	return parseNode;
	function parseNode(opt) {
		var handler = elementHandler.get(opt);
		// var partial = each(partialHandlers, function(ph) {
		// 	var match = ph.get(opt);
		// 	if (match) {
		// 		if (match.parseNode instanceof Function) {
		// 			opt = match.parseNode(opt);
		// 		}
		// 		this.result.push(match);
		// 	}
		// }, []);
		var {node, elAdapter, ctx, trPlugin} = opt;
		treeRenderPlugin(node, elAdapter, ctx, trPlugin);
		extraSave(node, {handler});//partial, 
		return node;
	}
}
