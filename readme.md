# AriJS

## Features

This framework originated from my insatisfaction of all the popular frameworks' method of rendering - comparing virtual DOM. I thought, "why can't updates mutate only exactly the elements that changed?" and this is what came out from that. I think it is similar to Svelte, without actually compiling your application.

These are the features already implemented and those still to do:

- [x] Parse templates
- [x] Mechanism to observe and be notified of property changes
- [x] Render one component
- [x] Interpolate variables in text content
- [x] Render sub components inside a component
- [x] Allow components to be replaced after render
- [x] Mechanism to load a component dynamically
- [ ] Bind attributes
- [ ] Bind events
- [ ] "if" directive
- [ ] "for" directive
- [ ] Implement slots
- [ ] Write tests
- [ ] Write documentation
- [ ] Write router
- [ ] Write server side rendering

This framework still lacks many big things, it's very early in the development. But this is also a opportunity to participate in it.

## Design Goals

I hated angular because it imposed its way of doing things. Then came out other frameworks that have a higher degree of freedom, however it still not complete. I want EVERYTHING to be, better than configurable, easy to COMPLETELY replace with your own custom implementation. Also performance, I will try to be as efficient as possible and have only the absolute minimum processing necessary.

## Example

> ### Previously
>
> See how the api evolved in previous versions.
>
> [2020-05-02 Example 00](https://github.com/arijs/ariframework/blob/master/docs/example-00.md)

The following showcases how you can create dynamic loaders which will load components with the path inferred from the component tag name.

```javascript
// This file is in /test/prefix-loader/index.mjs
import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import {queryStringify} from '@arijs/frontend/src/utils/query-string';
import {numberFormat} from '@arijs/frontend/src/utils/number-string';
import {
	composeHandlers,
	mapName,
} from '../../src/handler/element';
import htmlHandler from '../../src/handler/html';
import component from '../../src/component';
import prefixLoader from '../../src/loader/prefix';

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
```

## How to run

### Install

```
$ git clone https://github.com/arijs/ariframework.git

$ cd ariframework

$ npm install

$ npx rollup -c
```

### Use your server

Now use your server to access it. For example:

```
$ npm install http-server -g

$ npx http-server
```

Now you can visit http://localhost:8080/test/prefix-loader/ to see it in action.

## License

[MIT](LICENSE).
