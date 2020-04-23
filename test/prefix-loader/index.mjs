import {
	composeApis,
	mapName,
} from '../../src/handler/element';
import componentHandler from '../../src/handler/component';
import component from '../../src/component';
import {componentMatcher, prefix, loadComponent} from '../../src/loader/component';
import {extendDeepCreate} from '@arijs/frontend/src/utils/extend';
import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import {queryStringify} from '@arijs/frontend/src/utils/query-string';
import {numberFormat} from '@arijs/frontend/src/utils/number-string';

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

window.MyComp = {};

const myPrefix = {
	prefix: 'my--',
	basePath: 'my/',
	namePrefix: 'my/',
	getJsData({path}) {
		return MyComp[path];
	},
}

const myLoader = componentMatcher({
	// prefix: 'my--',
	match: ({name}) => prefix(name, myPrefix),
	onMatch(match) {
		var {id} = match;
		var ch = componentHandler();
		var compEx = {props: {name: match.fullName}};
		compEx = extendDeepCreate({}, componentLoading, compEx);
		ch.setComponent(compEx);
		myLoading.set(id, ch);
		match.onLoad = function({
			error,
			html: {data: html, error: htmlError},
			js: {data: js, error: jsError},
			css: {error: cssError},
			comp: {error: compError}
		}) {
			if (error) {
				compEx = {props: {
					name: match.fullName,
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
				myCache.set(id, componentHandler(comp));
				ch.setComponent(comp);
			}
			myLoading.set(id, void 0);
		};
		loadComponent(match);
		return ch;
	}
});

loadManager.setList([myCache, myLoading, myLoader]);

component({
	html: '<my--bt-box></my--bt-box>',
	elementHandler: loadManager,
	context: {
		store: {
			"( bar ) (key)": "value start - ( bar ) (key) - value end",
			"labelMain": Math.PI * 1e6,
			"labelSub": {a:1,b:2}
		},
		storeMods: {
			"(adv) ( foo )": function(val, params) {
				return JSON.stringify({val: val, params: params});
			},
			"nr": function(val, params) {
				return numberFormat(val, params.dlen, params.dsep, params.gsep, params.glen);
			},
			"fn": queryStringify
		}
	},
	onRender({el}) {
		replaceNodes(null, el, document.querySelector('body'))
	}
});
