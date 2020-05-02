
export function composeHandlers(list = []) {
	let others;
	const api = {
		injectOthers(ot) { others = ot; },
		get() {
			var self = this, args = arguments;
			var c = list.length;
			for (var i = 0; i < c; i++) {
				var item = list[i];
				if (others && item.injectOthers instanceof Function) {
					item.injectOthers(others);
				}
				let handler = item.get.apply(self, args);
				if (handler) {
					if (others) {
						var subList = list.slice(i+1, c);
						var nh = others.nextHandler;
						if (nh) {
							nh.setList(nh.getList().concat(subList));
						} else {
							others.nextHandler = nh = composeHandlers(subList);
						}
						others.rootHandler = api;
						others = void 0;
					}
					return handler;
				}
			}
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
