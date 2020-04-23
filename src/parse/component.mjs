import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';
import elementDefault from '@arijs/stream-xml-parser/src/element/default';
import parseText from './tree/text';
import fnParseNode from './tree/node';
import fnPluginParse from './tree/plugin';
import {options} from '@arijs/frontend/src/utils/extend';

const optDefault = {
	// node: null,
	elAdapter: elementDefault(),
	parsePlugin: null,
	ctxParse: null,
	ctxTree: null,
	elementHandler: null,
	parseText,
	parseNode: null,
	fnParseNode
};

export default function parseComponent(node, opt = {}) {
	// var ctx;
	// var elAdapter = StreamXMLParser.elementDefault();
	// html = fw_parseHtml(html, elAdapter);
	let {
		// node,
		elAdapter,
		parsePlugin,
		ctxParse,
		ctxTree,
		elementHandler,
		parseText,
		parseNode,
		fnParseNode
	} = options(optDefault, opt);
	if (!parsePlugin) {
		if (!parseNode) {
			parseNode = fnParseNode(elementHandler);
		}
		parsePlugin = fnPluginParse(
			ctxParse, parseText, parseNode
		);
	}
	return treeRenderPlugin(node, elAdapter, ctxTree, parsePlugin);
	// console.log('result parse', fpath);
	// console.log(html);
}
