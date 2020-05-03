
export default function mapName(map = {}) {
	const api = {
		get: ({name}) => map[name],
		set: (name, handler) => map[name] = handler,
		setMap: (newMap) => map = newMap,
		getMap: () => map,
	};
	return api;
}
