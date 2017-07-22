/*
  Resolves actions passed during create
*/

import clone from './clone'
import get from './get'
import notify from './notify'
import patch from './patch'

export const resolve = (internal, action, tree = {}, name) => {
  if (typeof action === 'function') {
    return (...args) => {
      let count = 0
      let deferred = false
      let update = (...args) => {
        let a = [...args]
        let up = a.pop()
        let path = a.join('.') || '*'
        let value = up(clone.deep(path === '*' ? internal.state : get(internal.state, path)), internal.state)
        internal.state = patch(internal.state, path, value)
        internal.queue.paths.push(path)
        internal.queue.details.push({name, count: count++, deferred, path, value})
        if (internal.queue.paths.length === 1) setTimeout(() => notify(internal), 0)
        setTimeout(() => { deferred = true }, 0)
      }
      action(update, ...args)
      return internal.store
    }
  } else if (typeof action === 'object') {
    Object.keys(action).forEach(key => { tree[key] = resolve(internal, action[key], tree[key], name ? `${name}.${key}` : key) })
  } else {
    throw new Error(`[Restore] Invlaid entry in action tree: '${name}' is a ${typeof action}.`)
  }
  return tree
}

export default resolve
