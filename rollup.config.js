import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
// // import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
// import minify from 'rollup-plugin-babel-minify';
import buble from '@rollup/plugin-buble';
import inject from '@rollup/plugin-inject';
// import pkg from './package.json';

function beforeExt(name, add) {
	var i = name.lastIndexOf('.');
	return i === -1
		? name+add
		: name.substr(0, i).concat(add, name.substr(i));
}

export default getFormats({
	noMinify: true
});

function getFormats(opt) {

const noMinify = opt && opt.noMinify;

function format(opt, plugin) {
	if (!(opt.plugins instanceof Array)) opt.plugins = [];
	opt.plugins.unshift(inject({
		// 'extend': ['@arijs/frontend/src/utils/extend.mjs', 'extend']
		// path.resolve('polyfill/object-assign.mjs')
		'extend': path.resolve( 'polyfill/extend.js' )
	}));
	opt.plugins.unshift(buble({
		objectAssign: 'extend',
		transforms: {
			dangerousForOf: true,
			...(opt.transforms || {})
		}
	}));
	opt.plugins.unshift(resolve({
		// resolveOnly: [/^@arijs\/(frontend|stream-xml-parser)\//gi],
		extensions: ['.mjs', '.js']
	}));
	list.push(opt);
	if (!noMinify) {
		var min = Object.assign({}, opt);
		min.output = Object.assign({}, min.output);
		min.output.file = beforeExt(min.output.file, '.min');
		min.plugins = (min.plugins || []).concat([plugin || uglify()]);
		list.push(min);
	}
}

var list = [];

format({
	input: 'test/prefix-loader/index.mjs',
	output: {
		name: 'ariTestPrefix',
		file: 'dist/test/prefix-loader.js',//pkg.browser,
		format: 'iife',
		indent: '',
		globals: {
			document: 'document',
			window: 'window',
			Capacitor: 'Capacitor'
		}
	}
});
// format({
// 	input: 'src/index.mjs',
// 	output: {
// 		name: pkg.export_var,
// 		file: pkg.main,
// 		format: 'cjs',
// 		indent: ''
// 	}
// });
// format({
// 	input: 'src/index.mjs',
// 	output: {
// 		name: pkg.export_var,
// 		file: pkg.module,
// 		format: 'esm',
// 		indent: ''
// 	}
// }, minify({
// 	comments: false,
// 	sourceMap: false
// }));
// format({
// 	input: 'src/index.mjs',
// 	output: {
// 		amd: {id: pkg.export_amd},
// 		name: pkg.export_var,
// 		file: pkg.module_amd,
// 		format: 'amd',
// 		indent: ''
// 	}
// });

return list;

}
