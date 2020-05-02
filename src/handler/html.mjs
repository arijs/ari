import renderChildren from '../render/tree/children';
import testHandler, {testHtml} from './test';

export const htmlHandlerRaw = {
	renderElement(opt) {
		const {node, elAdapter, renderAdapter} = opt;
		let out;
		if (elAdapter.isComment(node)) {
			return renderAdapter.initComment();
		} else if (elAdapter.isFragment(node)) {
			out = renderAdapter.initFragment();
		} else {
			out = renderAdapter.initName(elAdapter.nameGet(node));
			elAdapter.attrsEach(node, function(name, value, attr) {
				renderAdapter.attrsAdd(out, attr || {name, value});
			});
		}
		renderChildren(opt, {targetTree: out});
		return out;
	}
};

export const htmlHandler = testHandler(testHtml, htmlHandlerRaw);

export default htmlHandler;
