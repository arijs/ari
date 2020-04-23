import {callListeners} from '@arijs/frontend/src/utils/listeners';
import {arrayConcat} from '@arijs/frontend/src/utils/collection';
import replaceNodes from '@arijs/frontend/src/dom/replace-nodes';
import component from '../component';

export default function componentHandler(comp, handOnRender) {
	var listeners = [];
	var compOld;
	return {
		getComponent,
		setComponent,
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
	function renderElement(optRender) {
		var instanceOld, instance, compHandler;
		var {node, ctxRender: context} = optRender;
		var {onRender: compOnRender} = comp;
		listeners.push(renderComponent);
		compHandler = handOnRender instanceof Function && handOnRender(optRender);
		return renderComponent();
		function renderComponent() {
			instanceOld = instance;
			component({...comp, node, context, onRender});
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
			if (compHandler instanceof Function) {
				compHandler(instance, instanceOld);
			}
			if (compOnRender instanceof Function) {
				compOnRender.apply(this, arguments);
			}
		}
	}
}
