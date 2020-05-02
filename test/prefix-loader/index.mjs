import {
	composeHandlers,
	mapName,
} from '../../src/handler/element';
import htmlHandler from '../../src/handler/html';
import component from '../../src/component';
// import loadComponent from '../../src/loader/component';
import prefixLoader from '../../src/loader/prefix';
// import {extendDeepCreate} from '@arijs/frontend/src/utils/extend';
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

// prefix loader with loading and error components

window.MyComp = {};

const myLoader = prefixLoader({
	prefix: 'my--',
	basePath: 'my/',
	getJsData: ({path}) => MyComp[path],
	loadDelay: 5000,
	componentLoading,
	componentError,
});

// prefix loader with custom storage handlers for loaded and loading components

window.FooComp = {};

const fooCache = mapName();
const fooLoading = mapName();

const fooLoader = prefixLoader({
	prefix: 'foo--',
	basePath: 'foo/',
	getJsData: ({path}) => FooComp[path],
	handlerCache: fooCache,
	handlerLoading: fooLoading,
});

// combine all handlers into one manager, in the order they will be tested

const handlerManager = composeHandlers([htmlHandler, fooCache, fooLoading, myLoader, fooLoader]);

component({
	html: '<my--bt-box></my--bt-box><foo--404/><bar--404/>',
	elementHandler: handlerManager,
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
	},
	onError(error, comp) {
		console.error(error, comp);
	}
});
