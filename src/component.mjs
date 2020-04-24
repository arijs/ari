import context from './context';
import parseHtml from './parse/html';
import parseComponent from './parse/component';
import renderComponent from './render/component';
import extendNewOnly from '@arijs/frontend/src/utils/extend';

export function component(opt) {
	var {name, html, js, props, propMods, node, context: ctxParent, elementHandler, onRender} = opt;
	if (node) {
		var {nodeProps, nodePropMods} = getPropsFromNode(node, ctxParent);
		if (nodeProps) props = extendNewOnly(props, nodeProps);
		if (nodePropMods) propMods = extendNewOnly(propMods, nodePropMods);
	}
	if (!elementHandler) {
		({elementHandler} = ctxParent);
	}
	// var {getElementHandler} = ctxParent;
	var ctxRender = context({
		name,
		props,
		propMods,
		ctxParent,
		js,
		elementHandler,
	});
	var el, api;
	({elementHandler} = ctxRender);
	el = parseHtml(html);
	el = parseComponent(el, {elementHandler});
	el = renderComponent(el, {ctxRender});
	api = ctxRender.getApi(el);
	if (onRender instanceof Function) {
		onRender({api, el, context: ctxRender});
	}
	return api;
}

export function getPropsFromNode(node, ctxRender) {
	// @TODO: extract props and propMods from node
	var props, propMods;
	return {props, propMods};
}

export default component;
