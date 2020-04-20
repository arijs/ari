import {fnRenderVarsMods} from '@arijs/frontend/src/state/render-vars-mods';
import dynamicList from '@arijs/frontend/src/state/dictionary/dynamic-list';
import each from '@arijs/frontend/src/utils/for-each';

export function injectGetValue(ctxRender, vars, mods, cbError, name) {
	ctxRender.getValue = fnRenderVarsMods(vars, mods, cbError, name);
}

function eachFalsyRemove(item) {
	return item ? null : this._remove;
}

export function getCtxVars(ctx) {
	var list = [ctx.props, ctx.store, ctx.context];
	each(list, eachFalsyRemove);
	return list;
}

export function injectVars(ctx, name, cbError) {
	ctx.vars = dynamicList(getCtxVars(ctx), name, cbError);
}

export function getCtxMods(ctx) {
	var list = [ctx.propMods, ctx.storeMods, ctx.contextMods];
	each(list, eachFalsyRemove);
	return list;
}

export function injectMods(ctx, name, cbError) {
	ctx.mods = dynamicList(getCtxMods(ctx), name, cbError);
}

export const apiContext = {
	injectGetValue,
	injectVars,
	injectMods,
	getCtxVars,
	getCtxMods,
};

export function defaultContext(ctx) {
	var {name = 'context', cbError} = ctx;
	this.injectVars(ctx, name+' vars', cbError);
	this.injectMods(ctx, name+' mods', cbError);
	this.injectGetValue(ctx, ctx.vars, ctx.mods, cbError, name+' getvalue');
	return ctx;
}

export default function context(opt) {
	const {
		name,
		props,
		propMods,
		ctxParent,
		fnContext = defaultContext,
		getElementHandler,
	} = opt;
	return fnContext.call(apiContext, {
		name,
		data: null,
		dataMods: null,
		props,
		propMods,
		store: ctxParent.store,
		storeMods: ctxParent.storeMods,
		context: ctxParent.context,
		contextMods: ctxParent.contextMods,
		cbError: ctxParent.cbError,
		vars: null,
		mods: null,
		getElementHandler,
		getValue: null
	});
}
