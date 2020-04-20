import {decode} from '@arijs/frontend/src/utils/html-entities';
import {TreeBuilder, XMLParser} from '@arijs/stream-xml-parser/src/index';
import elementDefault from '@arijs/stream-xml-parser/src/element/default';

export default function parseHtml(html, elAdapter = elementDefault) {
	var tb = new TreeBuilder({
		element: elAdapter
	});
	var xp = new XMLParser({
		event: tb.parserEvent.bind(tb),
		decodeString: decode
	});
	xp.end(html);
	return tb.root.tag;
}
