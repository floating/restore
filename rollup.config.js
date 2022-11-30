import resolve from 'rollup-plugin-node-resolve'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const _require = createRequire(import.meta.url)
const pkg = _require('./package.json')

const input = fileURLToPath(new URL('src/index.js', import.meta.url))
const output = fileURLToPath(new URL('lib/index.js', import.meta.url))

export default {
  input: input,
  output: {
    file: output,
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
