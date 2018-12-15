import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import license from "rollup-plugin-license";
import { uglify } from "rollup-plugin-uglify";
import path from "path";
import pkg from "./package.json";

process.env.NODE_ENV = "production";

const createConfig = ({ umd = false, output } = {}) => ({
  input: "src/index.js",
  output,
  external: [
    ...Object.keys(umd ? {} : pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  /**
   * suppress false warnings https://github.com/rollup/rollup-plugin-babel/issues/84
   */
  onwarn: () => null,
  plugins: [
    babel({ runtimeHelpers: true }),
    resolve(),
    commonjs({ extensions: [".js", ".jsx"] }),
    umd && uglify(),
    license({
      banner: {
        file: path.join(__dirname, "LICENSE")
      }
    })
  ].filter(Boolean)
});

export default [
  createConfig({
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }),
  createConfig({
    umd: true,
    output: {
      file: pkg.unpkg,
      format: "umd",
      name: "ReactTextareaAutocomplete"
    }
  })
];
