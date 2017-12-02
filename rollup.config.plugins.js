import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';
import path from 'path';

process.env.NODE_ENV = 'production';

export default [
  babel(),
  resolve(),
  commonjs({ extensions: ['.js', '.jsx'] }),
  uglify(),
  license({
    banner: {
      file: path.join(__dirname, 'LICENSE'),
    },
  }),
];
