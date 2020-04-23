import {
	composeApis,
	mapName,
} from './handler/element';
import componentHandler from './handler/component';
import {componentMatcher, prefix, loadComponent} from './loader/component';
import {extendDeepCreate} from '@arijs/frontend/src/utils/extend';

var componentLoading = {
	html: '<div>Please wait, loading component {name}...</div>'
};
var componentError = {
	html: '\n\
	<div>Sorry, cannot load component {name}</div>\n\
	<div>Error: {error}</div>\n\
	<div>HTML: {htmlStatus}</div>\n\
	<div>JS: {jsStatus}</div>\n\
	<div>CSS: {cssStatus}</div>\n\
	<div>COMP: {compStatus}</div>\n\
	'
};

const loadManager = composeApis();

const myCache = mapName();
const myLoading = mapName();

const myLoader = componentMatcher({
	// prefix: 'my--',
	match: (name) => prefix('my--', name),
	getJsData({path}) {
		return MyComp[path];
	},
	onMatch(match) {
		var ch = componentHandler();
		var compEx = {props: {name: match.path}};
		compEx = extendDeepCreate({}, componentLoading, compEx);
		ch.setComponent(compEx);
		myLoading.set(path, ch);
		match.onLoad = function({
			error,
			html: {data: html, error: htmlError},
			js: {data: js, error: jsError},
			css: {error: cssError},
			comp: {error: compError}
		}) {
			if (error) {
				compEx = {props: {
					name: match.path,
					error: String(error),
					htmlStatus: String(htmlError || 'OK'),
					jsStatus: String(jsError || 'OK'),
					cssStatus: String(cssError || 'OK'),
					compStatus: String(compError || 'OK'),
				}};
				compEx = extendDeepCreate({}, componentError, compEx);
				ch.setComponent(compEx);
			} else {
				var comp = {html, js};
				myCache.set(path, componentHandler(comp));
				ch.setComponent(comp);
			}
			myLoading.set(path, void 0);
		};
		loadComponent(match);
		return ch;
	}
});

loadManager.setList([myCache, myLoading, myLoader]);

// setResult({html: {data: html}, js: {data: js}}, cb) {
// 	return {
// 		renderElement({node, elAdapter, renderAdapter, ctxRender, ctx}) {
// 			var myComp = component({
// 				html,
// 				js,
// 				getElementHandler: loadManager,
// 			})
// 		}
// 	};
// },