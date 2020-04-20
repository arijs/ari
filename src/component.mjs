import context from './context';
import parseHtml from './parse/html';
import parseComponent from './parse/component';
import renderComponent from './render/component';

export default function component(opt) {
	const {html, getElementHandler} = opt;
	opt.html = null; // erase reference to save memory
	html = parseHtml(html);
	var ctxRender = context(opt);
	html = parseComponent(html, {getElementHandler});
	var rendered = renderComponent(parsed, {ctxRender});
	return {
		opt,
		context: ctxRender,
		el: rendered
	};
}
