import context from './context';
import parseHtml from './parse/html';
// import parseComponent from './parse/component';
import renderComponent from './render/component';
import {
	extendNewOnly,
	extendDeepCreate,
} from '@arijs/frontend/src/utils/extend';
import {arrayConcat} from '@arijs/frontend/src/utils/collection';

export function fnOnErrorDefault(list) {
	onErrorDefault.extend = extend;
	return onErrorDefault;
	function onErrorDefault(error) {
		console.error(
			'Error on component',
			error,
			list,
		);
	}
	function extend(ex) {
		return fnOnErrorDefault([].concat(list || [], ex || []));
	}
}

function onErrorDefault(error, comp) {
	console.error(
		'Error on component',
		error,
		comp,
	);
}

export function component(opt) {
	const comp = {
		api: null,
		el: null,
		context: null,
		opt,
	};
	const {
		ref,
		html,
		js,
		node,
		context: ctxParent,
		onRender,
	} = opt;
	let {
		props,
		propMods,
		elementHandler,
		onError: onErrorDef
	} = opt;
	if (ctxParent) {
		onErrorDef = onErrorDef || ctxParent.onError;
		elementHandler = elementHandler || ctxParent.elementHandler;
	}
	if (!onErrorDef) onErrorDef = onErrorDefault;
	const onError = (error, sub) => onErrorDef(error, [comp, ...arrayConcat(sub)]);
	if (node) {
		var {nodeProps, nodePropMods} = getPropsFromNode(node, ctxParent);
		if (nodeProps) props = extendNewOnly(props, nodeProps);
		if (nodePropMods) propMods = extendNewOnly(propMods, nodePropMods);
	}
	// var {getElementHandler} = ctxParent;
	const ctxRender = comp.context = context({
		ref,
		props,
		propMods,
		ctxParent,
		js,
		elementHandler,
		onError,
	});
	comp.context = ctxRender;
	// ({elementHandler} = ctxRender);
	let el = parseHtml(html);
	// el = parseComponent(el, {elementHandler});
	el = comp.el = renderComponent(el, {ctxRender});
	let api = comp.api = ctxRender.getApi(el);
	if (onRender instanceof Function) onRender(comp);
	return api;
}

export function getPropsFromNode(node, ctxRender) {
	// @TODO: extract props and propMods from node
	var props, propMods;
	return {props, propMods};
}

export function componentExtend(base, extend) {
	return extendDeepCreate({}, base, extend);
}

export default component;
