
let extraKey = '$ariFramework';

export function extraSetKey(newKey) {
	extraKey = newKey;
}

export function extraSave(node, extra) {
	node[extraKey] = extra;
}

export function extraLoad(node, extraDefault) {
	const ne = node[extraKey];
	return null == ne ? extraDefault : ne;
}
