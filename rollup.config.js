import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

let pkg = require('./package.json')
let external = Object.keys(pkg.peerDependencies || {})

export default {
  entry: path.resolve(__dirname, 'src/index.js'),
  dest: path.resolve(__dirname, 'lib/index.js'),
  exports: 'named',
  useStrict: true,
  external: external,
  globals: {react: 'React'},
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
    // , uglify()
  ]
}
