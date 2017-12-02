import plugins from './rollup.config.plugins';

export default {
  input: 'src/index.js',
  external: ['react', 'prop-types'],
  /**
   * suppress false warnings https://github.com/rollup/rollup-plugin-babel/issues/84
   */
  onwarn: () => null,
  plugins,
  output: {
    file: 'index.umd.js',
    format: 'umd',
    name: 'ReactTextareaAutocomplete',
  },
};
