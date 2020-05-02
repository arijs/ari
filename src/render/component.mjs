import renderText from './tree/text';
import renderNode from './tree/node';
import renderPlugin from './tree/plugin';
import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';
import elementDefault from '@arijs/stream-xml-parser/src/element/default';
import elementDom from '@arijs/stream-xml-parser/src/element/dom';
import {options} from '@arijs/frontend/src/utils/extend';

const optDefault = {
	elAdapter: elementDefault(),
	renderAdapter: elementDom(document),
	ctxRender: null,
	renderPlugin,
	renderText,
	renderNode,
};

export default function renderComponent(node, opt = {}) {
	const {
		elAdapter,
		renderAdapter,
		renderPlugin,
		// ctxRender,
		// renderText,
		// renderNode,
	} = options(optDefault, opt);
	node = treeRenderPlugin(node, elAdapter, opt, renderPlugin, renderAdapter, true);
	return renderAdapter.toArray(node);
}
