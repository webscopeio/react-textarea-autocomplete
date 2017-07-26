import resolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';
import path from 'path';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  external: ['react', 'prop-types'],
  plugins: [
    resolve(),
    hypothetical({
      // https://github.com/rollup/rollup-plugin-commonjs/issues/194
      allowRealFiles: true,
      files: {
        './node_modules/core-js/library/modules/es6.object.to-string.js': 'export default null',
      },
    }),
    commonjs({ extensions: ['.js', '.jsx'] }),
    css({ output: 'dist/default-style.css' }),
    babel({
      presets: ['es2015-rollup', 'stage-2', 'react', 'flow'],
      plugins: ['external-helpers'],
      // Jest can't work properly with es2015-rollup inside the .babelrc, so this is walk-around
      babelrc: false,
      exclude: 'node_modules/**',
    }),
    uglify(),
    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
      },
    }),
  ],
  dest: 'dist/index.js',
};
