import {decode} from '@arijs/frontend/src/utils/html-entities';
import {TreeBuilder, XMLParser} from '@arijs/stream-xml-parser/src/index';

export default function parseHtml(html, elAdapter) {
	var tb = new TreeBuilder({
		element: elAdapter
	});
	var xp = new XMLParser({
		event: tb.parserEvent.bind(tb),
		// ↓ provide your decode function ↓
		decodeString: decode
	});
	xp.end(html);
	var a = {a:1};
	var b = {...a};
	var c = {...b, ...tb.root.tag};
	return c;
}
