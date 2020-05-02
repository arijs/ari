import {callListeners} from '@arijs/frontend/src/utils/listeners';
import {arrayConcat} from '@arijs/frontend/src/utils/collection';
import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import component from '../component';
import renderChildren from '../render/tree/children';

export default function componentHandler(comp, commentText) {//, handOnRender
	var listeners = [];
	var compOld;
	return {
		getComponent,
		setComponent,
		setCommentText,
		renderElement
	};
	function getComponent() {
		return comp;
	}
	function setComponent(compNew) {
		compOld = comp;
		comp = compNew;
		callListeners(listeners);
	}
	function setCommentText(ctNew) {
		commentText = ctNew;
	}
	function renderElement(optRender) {
		var instanceOld, instance, compOnRender;//, compHandler;
		var {node, renderAdapter, ctxRender: context} = optRender;
		if (comp) ({onRender: compOnRender} = comp);
		context = {
			...context,
			childrenDefault(optChildren) {
				return renderChildren(optRender, optChildren);
			}
		};
		listeners.push(renderComponent);
		// compHandler = handOnRender instanceof Function && handOnRender(optRender);
		return renderComponent();
		function renderComponent() {
			instanceOld = instance;
			if (comp) {
				component({...comp, node, context, onRender});
			} else {
				onRender({el: renderAdapter.initComment(commentText || '')});
			}
			return instance.el;
		}
		function onRender(instanceNew) {
			instance = instanceNew;
			if (instanceOld) {
				var {el: elOld} = instanceOld;
			}
			var {el} = instance;
			var oldFirst = elOld && arrayConcat(elOld)[0];
			var parent = oldFirst && oldFirst.parentNode;
			if (parent) {
				replaceNodes(elOld, el, parent);
			}
			// if (compHandler instanceof Function) {
			// 	compHandler(instance, instanceOld);
			// }
			if (compOnRender instanceof Function) {
				compOnRender.apply(this, arguments);
			}
		}
	}
}
