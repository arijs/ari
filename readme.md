# AriFramework

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

This framework still lacks many big things, it's very early in the development. But this is also a opportunity to participate in it.

## Design Goals

I hated angular because it imposed its way of doing things. Then came out other frameworks that have a higher degree of freedom, however it still not complete. I want EVERYTHING to be, better than configurable, easy to COMPLETELY replace with your own custom implementation. Also performance, I will try to be as efficient as possible and have only the absolute minimum processing necessary.

## Example

The following is a (almost?) complete example of everything already supported.

It defines a structure to load components dynamically, those components whose name begins with the prefix "my--". Then it defines what component to render while the requested component loads, and another component to render in case there is any error in the process of loading the component.

The framework has the concept of 'handlers' that define how each node in the template will be rendered. If no handler is found for a tag, the default is rendering a native html element. Because of this, if you define a handler for your component, every single tag will be tested against it.

To optimize the case that the vast majority of tags will be html elements and not components, we have a specific handler for html tags which simply returns an empty object that will trigger the default handling for html tags.

We have the `mapName` handler that directly maps tags to its handlers, good for already defined components. However, you might want to handle tags the moment you find them and not before. This allows you to handle a whole class of elements dynamically.

As already mentioned, if the framework finds any tag which starts with `my--`, it will try to load it from the path inferred from the tag name. You can also pass some props directly in the component definition. This is used below to show the name of the component being loaded and the errors if any.

These props are added only after the details of the component to be loaded have been defined, so we must take care to create new components with these details and not modify our original "loading" and "error" components, or else they will have old values when they are used again.

We also define `myCache` and `myLoading`. The first will store (cache) the components loaded successfully. The second will return the exact same handler used when the component was found for the first time. This guarantees that another load will not be fired if this component is requested again before the loading could finish.

We then use the `composeApis` function to test each element with each handler, and returns the first handler that accepts that element. Then we create our root component, with the html string, the handler to use in it, the context with props (properties available only to the component that receives it) and the store (properties that will be passed to every sub component all the way down).

The `Mods` suffix in `storeMods` indicates that its values are functions to be used when rendering a value inside the component's template. The function will receive the value being rendered and optionally some parameters that can further specify how to render the value.

Lastly, the `onRender` function is called with the result of the rendering, the element ready to be inserted in the DOM. The element is also returned in the object returned by the `component` function; however the options allow you to customize the return value of the component, and the `onRender` function is guaranteed to have the element.

```javascript
// This file is in /test/prefix-loader/index.mjs
import {
	composeApis,
	mapName,
	functionList,
} from '../../src/handler/element';
import componentHandler from '../../src/handler/component';
import htmlHandler from '../../src/handler/html';
import component from '../../src/component';
import loadComponent from '../../src/loader/component';
import loadPrefix from '../../src/loader/prefix';
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

const skipHtml = functionList([htmlHandler]);
const myCache = mapName();
const myLoading = mapName();

window.MyComp = {};

const myLoader = loadPrefix({
	tag: 'my--',
	basePath: 'my/',
	name: 'my/',
	getJsData({path}) {
		return MyComp[path];
	},
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

const handlerManager = composeApis([skipHtml, myCache, myLoading, myLoader]);

component({
	html: '<my--bt-box></my--bt-box>',
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
	}
});
```

## License

[MIT](LICENSE).
