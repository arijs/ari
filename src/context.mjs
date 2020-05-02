import fnRenderVarsMods from '@arijs/frontend/src/state/render-vars-mods';
import DynamicList from '@arijs/frontend/src/state/dictionary/dynamic-list';
import Dynamic from '@arijs/frontend/src/state/dictionary/dynamic';

function getDictionaries(list, name) {
	// return item ? null : this._remove;
	var c = list && list.length || 0;
	var dicts = [];
	for (var i = 0; i < c; i++) {
		var d = list[i];
		if (!d) continue;
		if (!(d instanceof Dynamic)) d = new Dynamic(d, name);
		dicts.push(d);
	}
	return dicts;
}

export function getCtxVars(ctx) {
	var list = [ctx.data, ctx.props, ctx.store, ctx.context];
	return getDictionaries(list, name);
}

export function injectVars(ctx, name, onError) {
	ctx.vars = new DynamicList(getCtxVars(ctx), name, onError);
}

export function getCtxMods(ctx) {
	var list = [ctx.dataMods, ctx.propMods, ctx.storeMods, ctx.contextMods];
	return getDictionaries(list, name);
}

export function injectMods(ctx, name, onError) {
	ctx.mods = new DynamicList(getCtxMods(ctx), name, onError);
}

export function injectGetValue(ctx, vars, mods, onError, name) {
	ctx.getValue = fnRenderVarsMods(vars, mods, onError, name);
}

export function defaultContext(ctx) {
	var {name = '<no name>', onError} = ctx;
	this.injectVars(ctx, name+' context vars', onError);
	this.injectMods(ctx, name+' context mods', onError);
	this.injectGetValue(ctx, ctx.vars, ctx.mods, onError, name+' getValue');
	return ctx;
}

export const apiContext = {
	getCtxVars,
	getCtxMods,
	injectVars,
	injectMods,
	injectGetValue,
	defaultContext,
	Dynamic,
	DynamicList,
	fnRenderVarsMods,
};

function nop() {}

export default function context(opt) {
	const {
		ref,
		props,
		propMods,
		ctxParent,
		elementHandler,
		onError,
	} = opt;
	let {js} = opt;
	if (ctxParent) {
		// these must be 'var' to be seen outside the 'if'
		var {
			store,
			storeMods,
			context,
			contextMods,
			onError: onErrorParent,
		} = ctxParent;
	}
	const ctx = {
		ref,
		opt,
		data: null,
		dataMods: null,
		props,
		propMods,
		store,
		storeMods,
		context,
		contextMods,
		childrenDefault: nop,
		childrenNamed: {},
		onError: onError || onErrorParent,
		vars: null,
		mods: null,
		elementHandler,
		getValue: null,
		el: null,
		getApi(el) { ctx.el = el; return ctx; },
	};
	if (!(js instanceof Function)) js = defaultContext;
	return js.call(apiContext, ctx);
}
