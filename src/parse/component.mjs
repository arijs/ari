import parseText from './tree/text';
import fnParseNode from './tree/node';
import fnPluginParse from './tree/plugin';
import {extraSave} from './tree/node-extras';
import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';
import elementDefault from '@arijs/stream-xml-parser/src/element/default';
import {options} from '@arijs/frontend/src/utils/extend';

const optDefault = {
	elAdapter: elementDefault(),
	parsePlugin: null,
	ctxParse: null,
	ctxTree: null,
	elementHandler: null,
	partialHandlers: null,
	extraSave,
	parseText,
	parseNode: null,
	fnParseNode
};

export default function parseComponent(node, opt = {}) {
	let {
		elAdapter,
		parsePlugin,
		ctxParse,
		ctxTree,
		elementHandler,
		partialHandlers,
		extraSave,
		parseText,
		parseNode,
		fnParseNode
	} = options(optDefault, opt);
	if (!parsePlugin) {
		if (!parseNode) {
			parseNode = fnParseNode(elementHandler, partialHandlers, extraSave);
		}
		parsePlugin = fnPluginParse(
			ctxParse, parseText, parseNode
		);
	}
	return treeRenderPlugin(node, elAdapter, ctxTree, parsePlugin);
}
