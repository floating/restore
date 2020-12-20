import path from 'path'
import resolve from 'rollup-plugin-node-resolve'

const pkg = require('./package.json')

export default {
  input: path.resolve(__dirname, 'src/index.js'),
  output: {
    file: path.resolve(__dirname, 'lib/index.js'),
    globals: { react: 'React' },
    strict: true,
    exports: 'named'
  },
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    })
  ]
}
