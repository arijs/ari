const path = require('path');
const rollup = require('rollup');
const resolve = require ('@rollup/plugin-node-resolve');
// // import commonjs from 'rollup-plugin-commonjs';
// const { uglify } from 'rollup-plugin-uglify';
// import minify from 'rollup-plugin-babel-minify';
const buble = require('@rollup/plugin-buble');
const inject = require('@rollup/plugin-inject');
const pkg = require('./package.json');
// see below for details on the options
const inputOptions = {
	input: 'src/parse/html',
	plugins: [
		buble({
			objectAssign: 'extend',
			transforms: {
				dangerousForOf: true
			}
		}),
		inject({
			// 'extend': ['@arijs/frontend/src/utils/extend.mjs', 'extend']
			'extend': path.resolve( 'polyfill/extend.js' )
		}),
		resolve({
			// resolveOnly: [/^@arijs\/(frontend|stream-xml-parser)\//gi],
			extensions: ['.mjs', '.js']
		})
	]
};
const outputOptions = {
	name: pkg.export_var,
	file: pkg.browser,
	format: 'iife',
	indent: ''
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

//   console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      // For assets, this contains
      // {
      //   fileName: string,              // the asset file name
      //   source: string | Uint8Array    // the asset source
      //   type: 'asset'                  // signifies that this is an asset
      // }
      console.log('Asset', chunkOrAsset);
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code
      //   dynamicImports: string[],      // external modules imported dynamically by the chunk
      //   exports: string[],             // exported variable names
      //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
      //   fileName: string,              // the chunk file name
      //   imports: string[],             // external modules imported statically by the chunk
      //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
      //   isEntry: boolean,              // is this chunk a static entry point
      //   map: string | null,            // sourcemaps if present
      //   modules: {                     // information about the modules in this chunk
      //     [id: string]: {
      //       renderedExports: string[]; // exported variable names that were included
      //       removedExports: string[];  // exported variable names that were removed
      //       renderedLength: number;    // the length of the remaining code in this module
      //       originalLength: number;    // the original length of the code in this module
      //     };
      //   },
      //   name: string                   // the name of this chunk as used in naming patterns
      //   type: 'chunk',                 // signifies that this is a chunk
      // }
      console.log('Chunk', chunkOrAsset.modules);
    }
  }

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
