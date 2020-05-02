import {extendDeepCreate} from '@arijs/frontend/src/utils/extend';
import {treeRenderPlugin} from '@arijs/stream-xml-parser/src/treerender';

export default function renderChildren(opt, {targetTree, ctx: subCtx}) {
	var {node, elAdapter, ctx, trPlugin, renderAdapter} = opt;
	subCtx = subCtx ? extendDeepCreate({}, ctx, subCtx) : ctx;
	return treeRenderPlugin(node, elAdapter, subCtx, trPlugin, renderAdapter, targetTree || true);
}
