import each from '@arijs/frontend/src/utils/for-each';
// import extend from '@arijs/frontend/src/utils/extend';

export function composeApis(list = []) {
	// function composeBefore(...other) {
	// 	return composeApis([...other].concat(list));
	// }
	// function composeAfter(...other) {
	// 	return composeApis(list.concat([...other]));
	// }
	const api = {
		get() {
			var self = this, args = arguments;
			return each(list, function(item) {
				let handler = item.get.apply(self, args);
				if (handler) {
					this.result = handler;
					return this._break;
				}
			});
		},
		// compose: composeBefore,
		// composeBefore,
		// composeAfter,
		setList: (newList) => list = newList,
		getList: () => list,
	};
	return api;
}

export function functionList(list = []) {
	// function composeBefore(...other) {
	// 	return composeApis([...other].concat([api]));
	// }
	// function composeAfter(...other) {
	// 	return composeApis([api].concat([...other]));
	// }
	const api = {
		get() {
			var self = this, args = arguments;
			return each(list, function(fn) {
				handler = fn.apply(self, args);
				if (handler) {
					this.result = handler;
					return this._break;
				}
			});
		},
		// compose: composeBefore,
		// composeBefore,
		// composeAfter,
		setList: (newList) => list = newList,
		getList: () => list,
	};
	return api;
}

export function mapName(map = {}) {
	// function composeBefore(...other) {
	// 	return composeApis([...other].concat([api]));
	// }
	// function composeAfter(...other) {
	// 	return composeApis([api].concat([...other]));
	// }
	// function composeMapBefore(otherMap) {
	// 	return mapName(extend({}, map, otherMap));
	// }
	// function composeMapAfter(otherMap) {
	// 	return mapName(extend({}, otherMap, map));
	// }
	const api = {
		get: ({name}) => map[name],
		set: (name, handler) => map[name] = handler,
		// compose: composeBefore,
		// composeBefore,
		// composeAfter,
		// composeMap: composeMapBefore,
		// composeMapBefore,
		// composeMapAfter,
		setMap: (newMap) => map = newMap,
		getMap: () => map,
	};
	return api;
}
