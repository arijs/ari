import testHandler from './test';
import {callListeners} from '@arijs/frontend/src/utils/listeners';
import {arrayConcat} from '@arijs/frontend/src/utils/collection';
import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import {printfGetMatch} from '@arijs/frontend/src/printf/parse';

export default function ifHandler(ifResult, ifOpt) {
	var commentText = ifOpt && ifOpt.commentText || '';
	// var handOnRender = ifOpt && ifOpt.handOnRender;
	var listeners = [];
	var ifResultOld;
	return {
		getIfResult,
		setIfResult,
		renderElement,
	};
	function getIfResult() {
		return ifResult;
	}
	function setIfResult(ifResultNew) {
		ifResultOld = ifResult;
		ifResult = ifResultNew;
		callListeners(listeners);
	}
	function renderElement(optRender, handlers) {
		var elOld, el;
		var {renderAdapter} = optRender;
		// var instanceHandler = handOnRender instanceof Function && handOnRender(optRender);
		listeners.push(renderIfResult);
		return renderIfResult();
		function renderIfResult() {
			elOld = el;
			if (ifResult) {
				el = handlers.next(optRender);
			} else {
				el = renderAdapter.initComment(commentText);
			}
			var oldFirst = elOld && arrayConcat(elOld)[0];
			var parent = oldFirst && oldFirst.parentNode;
			if (parent) {
				replaceNodes(elOld, el, parent);
			}
			// if (instanceHandler instanceof Function) {
			// 	instanceHandler(ifResult, ifResultOld);
			// }
			return el;
		}
	}
}

export function ifTester(test) {
	return testHandler(
		test,
		({result: {ifSrc, text, key, mod, params}, opt: {ctxRender}}) => {
			const ih = ifHandler(ctxRender.getValue(key, mod, params, function(update) {
				ih.setIfResult(update);
			}), {commentText: 'ifHandler '+(ifSrc||'')+' = '+text});
			return ih;
		}
	);
}

export function ifTestAttr(ifAttrName) {
	return function (node, {elAdapter}) {
		var found;
		elAdapter.attrsEach(node, function(name, value) {
			if (name === ifAttrName) {
				found = printfGetMatch(value);
				if (found) found.ifSrc = name;
				return this._remove | this._break;
			}
		});
		return found;
	};
}

export function ifAttr(ifAttrName) {
	return ifTester(ifTestAttr(ifAttrName));
}
