// import each from '@arijs/frontend/src/utils/for-each';

// function getSubContextDefault(ctx) { return ctx; }

export default function renderNode(opt) {
	const { ctxRender: {elementHandler: rootHandler, onError} } = opt;
	return renderHandler(rootHandler, opt);
	function renderHandler(nextHandler, opt) {
		const others = {
			nextHandler,
			rootHandler,
		};
		const otherHandlers = {
			next: (opt) => renderHandler(others.nextHandler, opt),
			root: (opt) => renderHandler(rootHandler, opt),
		};
		if (nextHandler.injectOthers instanceof Function) {
			nextHandler.injectOthers(others);
		}
		const handler = nextHandler.get(opt.node, opt);
		if (handler) {
			return handler.renderElement(opt, otherHandlers);
		} else {
			const {node, elAdapter, renderAdapter} = opt;
			const message = 'No handler found for node '+elAdapter.nameGet(node);
			onError({ message, node, opt });
			return renderAdapter.initComment(message);
		}
	}
}
