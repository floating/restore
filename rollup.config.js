import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

let pkg = require('./package.json')

export default {
  input: path.resolve(__dirname, 'src/index.js'),
  output: {
    file: path.resolve(__dirname, 'lib/index.js'),
    globals: {react: 'React'},
    strict: true,
    exports: 'named'
  },
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    resolve({
      extensions: [ '.js', '.jsx' ]
    }),
    babel({
      sourceMap: true,
      exclude: 'node_modules/**',
      presets: ['react', ['es2015', {'modules': false}], 'stage-0'],
      plugins: ['external-helpers'],
      babelrc: false
    })
  ]
}
