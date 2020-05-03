import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import {queryStringify} from '@arijs/frontend/src/utils/query-string';
import {numberFormat} from '@arijs/frontend/src/utils/number-string';
import composeHandlers from '../../src/handler/compose';
import mapName from '../../src/handler/map-name';
import htmlHandler from '../../src/handler/html';
import component from '../../src/component';
import prefixLoader from '../../src/loader/prefix';
import {ifAttr} from '../../src/handler/if';
import {Dynamic} from '../../src/context';

// prefix loader with loading and error components

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

const handlerManager = composeHandlers([ifAttr('a-if'), htmlHandler, fooCache, fooLoading, myLoader, fooLoader]);

const store = new Dynamic({
	"( bar ) (key)": "value start - ( bar ) (key) - value end",
	"labelMain": Math.PI * 1e6,
	"labelSub": {a:1,b:2},
	"if-0": true,
	"if-0-timer": true,
}, 'AriJS TestPrefix Store');

let iv_if0;
const if0TimerChange = (v) => {
	if (v && !iv_if0) {
		let last = v;
		iv_if0 = setInterval(() => store.set('if-0', last = !last), 1000);
	} else if (!v && iv_if0) {
		iv_if0 = void clearInterval(iv_if0);
	}
}
if0TimerChange(store.get('if-0-timer', if0TimerChange));

const storeMods = new Dynamic({
	"(adv) ( foo )": function(val, params) {
		return JSON.stringify({val, params});
	},
	"nr": function(val, {dlen, dsep, gsep, glen} = {dlen: 2}) {
		return numberFormat(val, dlen, dsep, gsep, glen);
	},
	"fn": queryStringify,
	"not": v => !v,
}, 'AriJS TestPrefix StoreMods');

export default component({
	html: '\n\
	<my--bt-box></my--bt-box>\n\
	<foo--404/>\n\
	<bar--404/>\n\
	<div a-if="{if-0}" style="background:lime;">if 0 true</div>\n\
	<div a-if="{not:if-0}" style="background:red;">if 0 false</div>\n\
	',
	elementHandler: handlerManager,
	context: { store, storeMods },
	onRender({el}) {
		replaceNodes(null, el, document.querySelector('body'))
	},
	onError(error, comp) {
		console.error(error, comp);
	}
});

/*
// Try running this on the developer console:

ariTestPrefix.store.set('if-0-timer', false)

ariTestPrefix.store.set('if-0-timer', true)

*/
