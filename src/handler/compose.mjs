
export default function composeHandlers(list = []) {
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
						others.nextHandler = composeHandlers(subList);
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
