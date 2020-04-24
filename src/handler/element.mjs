import each from '@arijs/frontend/src/utils/for-each';

export function composeApis(list = []) {
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
		setList: (newList) => list = newList,
		getList: () => list,
	};
	return api;
}

export function functionList(list = []) {
	const api = {
		get() {
			var self = this, args = arguments;
			return each(list, function(fn) {
				var handler = fn.apply(self, args);
				if (handler) {
					this.result = handler;
					return this._break;
				}
			});
		},
		setList: (newList) => list = newList,
		getList: () => list,
	};
	return api;
}

export function mapName(map = {}) {
	const api = {
		get: ({name}) => map[name],
		set: (name, handler) => map[name] = handler,
		setMap: (newMap) => map = newMap,
		getMap: () => map,
	};
	return api;
}
