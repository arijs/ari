
const reHtml = /^[a-z0-9]$/;
const handler = {};

export default function renderHtml({name}) {
	if (reHtml.test(name)) return handler;
	// this is just a optimization to avoid checking
	// every html tag to see if it is a component
}
