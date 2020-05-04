# AriJS

## Highlights

- **No Virtual DOM:** AriJS keeps track of which elements are bound to which variables, when a variable changes, the affected elements are updated directly without comparing every element. This is good for performance and the simplicity of rendering.
- **Ultra flexible:** You choose how you want to use it. You have access to the low-level components and you can modify or extend every builtin behavior, or you can just use high-level apis and let the framework do the heavy lifting for you. It is almost a meta-framework, a library that doesn't stand in your way.
- **Lazy load for components:** There's no need to bundle every component into your application even if they're not used. You don't even have to mantain a list of component names, or generate one during build. AriJS provides a loader which can resolve a component path from its tag name, and load its html, js and css only when it's actually required.
- **Template based:** It's not impossible for AriJS to support JSX, but this feature does not exist yet. However, it would kind of defeat the point, because it would introduce significant complexity. It's harder to parse javascript *and* html, instead of just parsing html. And there's an advantage to using templates. They're simpler, don't require you to compile your script, but I think the fundamental difference is keeping your markup and behavior separated.

  Think about PHP: it started as a templating language, to dynamically print your html. But now that style is frowned upon. Having an imperative language to generate your html (a declarative language) gives a lot of power, but with great power comes great responsibility. And a free footgun. Leaving your template separated allows you to use it outside your frontend framework.
- **Modular and lightweight:** The core of the framework is parsing html and binding variables to a notification system. Every other feature is provided as handlers: objects that define how tags are rendered. They are composable, each handler can call the next allowing features to be composed together. This gives them absolute freedom about how to render elements.

## Features

This framework originated from my insatisfaction of all the popular frameworks' method of rendering - comparing virtual DOM. I thought, "why can't updates mutate only exactly the elements that changed?" and this is what came out from that. I think it is similar (*in concept, not in api*) to Svelte, without actually compiling your application.

These are the features already implemented and those still to do:

- [x] Parse templates
- [x] Mechanism to observe and be notified of property changes
- [x] Render one component
- [x] Interpolate variables in text content
- [x] Render sub components inside a component
- [x] Allow components to be replaced after render
- [x] Mechanism to load a component dynamically
- [x] "if" directive
- [ ] "for" directive **(in progress)**
- [ ] Bind attributes
- [ ] Bind events
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
> [2020-05-02 Example 00](https://github.com/arijs/ari/blob/master/docs/example-00.md)

The following showcases how you can create dynamic loaders which will load components with the path inferred from the component tag name.

This example is deliberately more complex than necessary only to showcase many features at once. 

```javascript
// This file is in /test/prefix-loader/index.mjs
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
		let last = store.get('if-0');
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
```

## How to run

### Install

```
$ git clone https://github.com/arijs/ari.git

$ cd ari

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
