
function compPathBase(param, match) {
	return param instanceof Function ? param(match) : match.href;
}
function compPathResource(param, match, extension) {
	return param === false ? null :
		param instanceof Function ? param(match) :
		match.url + extension;
}

export function prefix(opt) {
	let {
		tag: prefixTag,
		basePath = '',
		name: prefixName = prefixTag,
		extHtml = '.html',
		extJs = '.js',
		extCss = '.css',
	} = opt;
	prefixTag = String(prefixTag).toLowerCase();
	return {get};
	function get({name: id}) {
		const plen = prefixTag.length;
		if (id.substr(0, plen).toLowerCase() === prefixTag) {
			const path = id.substr(plen).replace(/--/g,'/');
			const last = path.lastIndexOf('/');
			const name = path.substr(last+1);
			const href = basePath+path+'/'+name;
			const fullName = prefixName + path;
			const match = {id, href, path, name, fullName};
			match.url       = compPathBase(opt.getUrl, match);
			match.pathHtml  = compPathResource(opt.pathHtml, match, extHtml);
			match.pathJs    = compPathResource(opt.pathJs  , match, extJs  );
			match.pathCss   = compPathResource(opt.pathCss , match, extCss );
			return opt.onMatch(match);
		}
	}
}

export default prefix;
