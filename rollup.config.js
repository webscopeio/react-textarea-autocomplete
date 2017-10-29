import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';
import copy from 'rollup-plugin-copy';
import path from 'path';

export default {
  input: 'src/index.js',
  external: ['react', 'prop-types', 'textarea-caret'],
  /**
   * suppress false warnings https://github.com/rollup/rollup-plugin-babel/issues/84
   */
  onwarn: () => null,
  plugins: [
    copy({
      src: 'es6',
    }),
    babel(),
    resolve(),
    commonjs({ extensions: ['.js', '.jsx'] }),
    uglify(),
    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
      },
    }),
  ],
  output: {
    file: 'index.js',
    format: 'cjs',
  },
};
