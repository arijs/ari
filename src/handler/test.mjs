
export default function testHandler(fnTest, onMatch) {
	return {
		get(node, opt) {
			const result = fnTest(node, opt);
			if (result) return onMatch instanceof Function
				? onMatch({result, node, opt})
				: onMatch;
		}
	};
}

export function fnTestNamePrefix(prefix) {
	const plen = prefix.length;
	return test;
	function test(node) {
		const {name} = node;
		if (name.substr(0, plen) === prefix) {
			return { name, prefix, suffix: name.substr(plen) };
		}
	}
}

const reHtml = /^[a-z0-9]+$/;

export function testHtml({name}) {
	return reHtml.test(name);
}
