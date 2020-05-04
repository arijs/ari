import mapName from '../handler/map-name';
import testHandler, {fnTestNamePrefix} from '../handler/test';
import componentHandler from '../handler/component';
import loadComponent from '../loader/component';
import {componentExtend} from '../component';
import extend from '@arijs/frontend/src/utils/extend';

function compPathBase(param, match) {
	return param instanceof Function ? param(match) : match.href;
}
function compPathResource(param, match, extension) {
	return param === false ? null :
		param instanceof Function ? param(match) :
		match.url + extension;
}

export function getPrefixPaths(optPrefix, match) {
	let {
		prefix,
		suffix,
	} = match;
	let {
		basePath = '',
		extHtml = '.html',
		extJs = '.js',
		extCss = '.css',
		pathHtml,
		pathJs,
		pathCss,
	} = optPrefix;
	const reDash = /--/g;
	const path = suffix.replace(reDash,'/');
	const lastIndex = path.lastIndexOf('/');
	const lastName = path.substr(lastIndex+1);
	const href = basePath+path+'/'+lastName;
	const id = prefix.replace(reDash,'/')+path;
	extend(match, optPrefix);
	match.id = id;
	match.href = href;
	match.path = path;
	match.url = compPathBase(optPrefix.getUrl, match);
	match.pathHtml = compPathResource(pathHtml, match, extHtml);
	match.pathJs   = compPathResource(pathJs  , match, extJs  );
	match.pathCss  = compPathResource(pathCss , match, extCss );
	return match;
}

function getPrefixProps(match) {
	const {name, id} = match;
	return {name, id};
}

function getLoadComp({
	html: {data: html},
	js: {data: js},
}, ref) {
	return {html, js, ref};
}

function getLoadErrorProps({
	error,
	html: {error: htmlError},
	js: {error: jsError},
	css: {error: cssError},
	comp: {error: compError},
}, match) {
	return {
		...getPrefixProps(match),
		error: String(error),
		htmlStatus: String(htmlError || 'OK'),
		jsStatus: String(jsError || 'OK'),
		cssStatus: String(cssError || 'OK'),
		compStatus: String(compError || 'OK'),
	};
}

function isLoadError({error}) {
	return error;
}

function getError(load, match, node, opt) {
	const {error} = load;
	return { error, load, match, node, opt };
}

function compExProps(comp, props) {
	return comp && componentExtend(comp, {props});
}

function getLoadingComment({name}) {
	return 'Loading '+name;
}

function getErrorComment({error}) {
	return error;
}

export default function prefixLoader(optPrefix) {

	const {
		handlerCache: optCache,
		handlerLoading: optLoading,
	} = optPrefix;
	const cache = optCache || mapName();
	const loading = optLoading || mapName();
	return testHandler(
		fnTestNamePrefix(optPrefix.prefix),
		({result: match, node, opt: optHandler}) => {
			var ch;
			match = getPrefixPaths(optPrefix, match);
			var {
				loadDelay,
				name,
				componentLoading,
				componentError,
			} = match;
			if (!optCache) {
				ch = cache.get(node, optHandler);
				if (ch) return ch;
			}
			if (!optLoading) {
				ch = loading.get(node, optHandler);
				if (ch) return ch;
			}
			var ch = componentHandler(
				compExProps(componentLoading, getPrefixProps(match)),
				getLoadingComment(match),
			);
			loading.set(name, ch);
			match.onLoad = function(load) {
				if (isLoadError(load)) {
					ch.setCommentText(getErrorComment(load, match));
					ch.setComponent(
						compExProps(componentError, getLoadErrorProps(load, match))
					);
					const { ctxRender: { onError } } = optHandler;
					onError(getError(load, match, node, optHandler));
				} else {
					var comp = getLoadComp(load, match);
					cache.set(name, componentHandler(comp));
					ch.setComponent(comp);
				}
				loading.set(name, void 0);
			};
			if (parseInt(loadDelay) === loadDelay && loadDelay > 0) {
				setTimeout(() => loadComponent(match), loadDelay);
			} else {
				loadComponent(match);
			}
			return ch;
		}
	);
}
