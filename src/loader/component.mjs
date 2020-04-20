import loadAjax from '@arijs/frontend/src/loaders/ajax';
import loadScript from '@arijs/frontend/src/loaders/script';
import loadStylesheet from '@arijs/frontend/src/loaders/stylesheet';

export function compPrefixPath(prefix, id) {
	//console.log('Component Dynamic: '+id);
	var plen = prefix.length;
	if (id.substr(0, plen).toLowerCase() === prefix) {
		var path = id.substr(plen).replace(/--/g,'/');
		var last = path.lastIndexOf('/');
		var name = path.substr(last+1);
		var href = path+'/'+name;
		return {
			id,
			path,
			name,
			href
		};
	}
}

export function fnPrefixLoader(opt) {
	var listenersMap = {};
	return match;
	function match(id) {
		var match = compPrefixPath(opt.prefix, id);
		var getUrl = opt.getUrl;
		var setResult = opt.setResult;
		var pathHtml = opt.pathHtml;
		var pathJs = opt.pathJs;
		var pathCss = opt.pathCss;
		if (match) {
			match.url      = getUrl   ? getUrl  (match) : match.href;
			match.pathHtml = pathHtml ? pathHtml(match) : match.url+'.html';
			match.pathJs   = pathJs   ? pathJs  (match) : match.url+'.js'  ;
			match.pathCss  = pathCss  ? pathCss (match) : match.url+'.css' ;
			match.load = function(callback, params) {
				match.params = params;
				return prefixLoader(match, callback);
			};
			if (setResult instanceof Function) {
				match.setResult = function(callback, load) {
					setResult(match, callback, load);
				};
			}
		}
		return match;
	}
	function prefixLoader(match, callback) {
		var path = match.path;
		var loadedMap = opt.loadedMap;
		var comp = loadedMap && loadedMap[path];
		if (comp) return callback(null, comp, match);
		var matchListeners = listenersMap[path];
		if (matchListeners) {
			matchListeners.push(callback);
			return;
		}
		listenersMap[path] = matchListeners = [callback];

		// var fnLoad = opt.loader(match);
		// fnLoad(function resolve() {
		// 	comp = match.result;
		// 	loadedMap && (loadedMap[path] = comp);
		// 	// return callback(null, comp);
		// 	for (var i = 0, ii = matchListeners.length; i < ii; i++) {
		// 		matchListeners[i](null, comp, match);
		// 	}
		// 	listenersMap[path] = void 0;
		// }, function reject(err) {
		// 	for (var i = 0, ii = matchListeners.length; i < ii; i++) {
		// 		matchListeners[i](err, comp, match);
		// 	}
		// 	listenersMap[path] = void 0;
		// });
	}
}

export default function loadComponent(opt) {
	//console.log('Component Dynamic: '+id);
	var load = {
		opt: opt,
		comp: {
			error: null,
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
				opt.cb(load);
			} else {
				opt.setResult(function(error) {
					comp.error = error;
					comp.done = true;
					itemLoad();
				}, load)
			}
		}
	}
	loadAjax({
		url: html.path,
		cb(resp) {
			html.error = resp.error;
			html.data = resp.data;
			html.resp = resp;
			itemLoad();
		}
	});
	loadScript(js.path, function(error) {
		js.error = error;
		if (!error && opt.dataJs) {
			try {
				js.data = opt.dataJs();
			} catch (e) {
				js.error = e;
			}
		}
		itemLoad();
	});
	loadStylesheet(css.path, function(error) {
		css.error = error;
		itemLoad();
	});
}
