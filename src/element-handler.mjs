import each from '@arijs/frontend/src/utils/for-each';
import extend from '@arijs/frontend/src/utils/extend';

export function composeApis(list) {
	function composeBefore(...other) {
		return composeApis([...other].concat(list));
	}
	function composeAfter(...other) {
		return composeApis(list.concat([...other]));
	}
	const api = {
		get(...args) {
			return each(list, function(item) {
				let handler = item.get(...args);
				if (handler) {
					this.result = handler;
					return this._break;
				}
			});
		},
		compose: composeBefore,
		composeBefore,
		composeAfter,
	};
	return api;
}

export function functionList(list) {
	function composeBefore(...other) {
		return composeApis([...other].concat([api]));
	}
	function composeAfter(...other) {
		return composeApis([api].concat([...other]));
	}
	const api = {
		get(...args) {
			return each(list, function(fn) {
				handler = fn(...args);
				if (handler) {
					this.result = handler;
					return this._break;
				}
			});
		},
		compose: composeBefore,
		composeBefore,
		composeAfter,
	};
	return api;
}

export function mapName(map) {
	function composeBefore(...other) {
		return composeApis([...other].concat([api]));
	}
	function composeAfter(...other) {
		return composeApis([api].concat([...other]));
	}
	function composeMapBefore(otherMap) {
		return mapName(extend({}, map, otherMap));
	}
	function composeMapAfter(otherMap) {
		return mapName(extend({}, otherMap, map));
	}
	const api = {
		get(...args) {
			let handler;
			if (apiBefore) {
				handler = apiBefore(...args);
				if (handler) return handler;
			}
			handler = map[args[0]];
			if (handler) return handler;
			if (apiAfter) {
				handler = apiAfter(...args);
				if (handler) return handler;
			}
		},
		compose: composeBefore,
		composeBefore,
		composeAfter,
		composeMap: composeMapBefore,
		composeMapBefore,
		composeMapAfter,
	};
	return api;
}

export default functionList;
