import loadAjax from '@arijs/frontend/src/loaders/ajax';
import loadScript from '@arijs/frontend/src/loaders/script';
import loadStylesheet from '@arijs/frontend/src/loaders/stylesheet';
import extend from '@arijs/frontend/src/utils/extend';
// import {applyListeners} from '@arijs/frontend/src/utils/listeners';

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
