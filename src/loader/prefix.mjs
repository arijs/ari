import mapName from '../handler/map-name';
import testHandler, {fnTestNamePrefix} from '../handler/test';
import componentHandler from '../handler/component';
import loadComponent from '../loader/component';
import {componentExtend} from '../component';
// import {extendDeepCreate} from '@arijs/frontend/src/utils/extend';

function compPathBase(param, match) {
	return param instanceof Function ? param(match) : match.href;
}
function compPathResource(param, match, extension) {
	return param === false ? null :
		param instanceof Function ? param(match) :
		match.url + extension;
}

export function getPrefixPaths(opt) {
	let {
		prefix,
		suffix,
		basePath = '',
		extHtml = '.html',
		extJs = '.js',
		extCss = '.css',
		pathHtml,
		pathJs,
		pathCss,
	} = opt;
	const reDash = /--/g;
	const path = suffix.replace(reDash,'/');
	const lastIndex = path.lastIndexOf('/');
	const lastName = path.substr(lastIndex+1);
	const href = basePath+path+'/'+lastName;
	const id = prefix.replace(reDash,'/')+path;
	const match = {...opt, id, href, path};
	match.url = compPathBase(opt.getUrl, match),
	match.pathHtml = compPathResource(pathHtml, match, extHtml);
	match.pathJs   = compPathResource(pathJs  , match, extJs  );
	match.pathCss  = compPathResource(pathCss , match, extCss );
	return match;
}

function getPrefixProps(opt) {
	const {name, id} = opt;
	return {name, id};
}

export default function prefixLoader(opt) {

	const {
		handlerCache: optCache,
		handlerLoading: optLoading,
	} = opt;
	const cache = optCache || mapName();
	const loading = optLoading || mapName();
	return testHandler(
		fnTestNamePrefix(opt.prefix),
		({result: match, node, opt: optHandler}) => {
			var ch, compEx;
			match = getPrefixPaths({...opt, ...match});
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
			var props = getPrefixProps(match);
			compEx = {props: {...props}};
			compEx = componentLoading &&
				componentExtend(componentLoading, compEx);
			var ch = componentHandler(compEx, 'Loading '+name);
			loading.set(name, ch);
			match.onLoad = function(load) {
				const {
					error,
					html: {data: html, error: htmlError},
					js: {data: js, error: jsError},
					css: {error: cssError},
					comp: {error: compError}
				} = load;
				if (error) {
					compEx = {props: {
						...props,
						error: String(error),
						htmlStatus: String(htmlError || 'OK'),
						jsStatus: String(jsError || 'OK'),
						cssStatus: String(cssError || 'OK'),
						compStatus: String(compError || 'OK'),
					}};
					compEx = componentError &&
						componentExtend(componentError, compEx);
					ch.setCommentText('Loading '+name+': '+error);
					ch.setComponent(compEx);
					const { ctxRender: { onError } } = optHandler;
					onError({ message: String(error), load, node, opt: optHandler });
				} else {
					var comp = {ref: match, html, js};
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
