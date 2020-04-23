import loadAjax from '@arijs/frontend/src/loaders/ajax';
import loadScript from '@arijs/frontend/src/loaders/script';
import loadStylesheet from '@arijs/frontend/src/loaders/stylesheet';
import extend from '@arijs/frontend/src/utils/extend';
// import {applyListeners} from '@arijs/frontend/src/utils/listeners';

export function prefix(id, opt) {
	//console.log('Component Dynamic: '+id);
	var {prefix, basePath = '', namePrefix = ''} = opt;
	prefix = String(prefix).toLowerCase();
	var plen = prefix.length;
	if (id.substr(0, plen).toLowerCase() === prefix) {
		var path = id.substr(plen).replace(/--/g,'/');
		var last = path.lastIndexOf('/');
		var name = path.substr(last+1);
		var href = basePath+path+'/'+name;
		var fullName = namePrefix + path;
		return {...opt, id, href, path, name, fullName};
	}
}

function compPathBase(param, match) {
	return param instanceof Function ? param(match) : match.href;
}
function compPathResource(param, match, extension) {
	return param === false ? null :
		param instanceof Function ? param(match) :
		match.url + extension;
}

export function componentMatcher(opt) {
	// var listenersMap = {};
	return {get};
	function get() {
		var match = opt.match.apply(this, arguments);
		// var [name] = args;
		// var match = compPrefixPath(opt.prefix, name);
		if (match) {
			match.args      = arguments;
			match.optMatch  = opt;
			match.onLoad    = opt.onLoad;
			match.url       = compPathBase(opt.getUrl, match);
			match.pathHtml  = compPathResource(opt.pathHtml, match, '.html');
			match.pathJs    = compPathResource(opt.pathJs  , match, '.js'  );
			match.pathCss   = compPathResource(opt.pathCss , match, '.css' );
			return opt.onMatch(match);
		}
	}
	// function prefixLoader(match, callback) {
	// 	var path = match.path;
	// 	var matchListeners = listenersMap[path];
	// 	if (matchListeners) {
	// 		matchListeners.push(callback);
	// 		return;
	// 	}
	// 	listenersMap[path] = matchListeners = [callback];
	// 	match.cb = function(error) {
	// 		loadedMap && !error && (loadedMap[path] = this);
	// 		applyListeners(matchListeners, arguments, this);
	// 		listenersMap[path] = void 0;
	// 	};
	// 	loadComponent(match);
	// }
}

export function loadComponent(opt) {
	//console.log('Component Dynamic: '+id);
	var load = {
		optMatch: opt,
		comp: {
			error: null,
			data: null,
			done: !opt.setResult
		},
		html: {
			path: opt.pathHtml,
			error: null,
			data: null,
			resp: null,
			done: !opt.pathHtml,
		},
		js: {
			path: opt.pathJs,
			error: null,
			data: null,
			done: !opt.pathJs,
		},
		css: {
			path: opt.pathCss,
			error: null,
			done: !opt.pathCss,
		},
		error: null,
		done: false,
	};
	var {html, js, css, comp} = load;
	function anyError() {
		var names = [];
		if (comp.error) names.push('comp');
		if (html.error) names.push('html');
		if (js  .error) names.push('js'  );
		if (css .error) names.push('css' );
		if (names.length) {
			load.error = new Error('Component '+opt.name+': Error loading '+names.join(', '));
		}
	}
	function itemLoad() {
		if (!load.done && html.done && js.done && (css.done || !opt.waitCss)) {
			if (comp.done) {
				anyError();
				opt.onLoad(load);
			} else {
				opt.setResult(load, function(compResult) {
					extend(comp, compResult);
					comp.done = true;
					itemLoad();
				});
			}
		}
	}
	loadAjax({
		url: html.path,
		cb(resp) {
			html.done = true;
			html.error = resp.error;
			html.data = resp.data;
			html.resp = resp;
			itemLoad();
		}
	});
	loadScript(js.path, function(error) {
		js.done = true;
		js.error = error;
		if (!error && opt.getJsData) {
			try {
				js.data = opt.getJsData(opt);
			} catch (e) {
				js.error = e;
			}
		}
		itemLoad();
	});
	loadStylesheet(css.path, function(error) {
		css.done = true;
		css.error = error;
		itemLoad();
	});
}

export default loadComponent;
