/*
  Resolves actions passed during create
*/

import clone from './clone'
import get from './get'
import notify from './notify'
import patch from './patch'
import pathway from './pathway'

export const resolve = (internal, action, tree = {}, name) => {
  if (typeof action === 'function') {
    return (...args) => {
      let count = 0
      let deferred = false
      let update = (...args) => {
        args = [...args]
        let up = args.pop()
        let path = pathway(args) || '*'
        let value = up(clone.deep(path === '*' ? internal.state : get(internal.state, path)), internal.state)
        internal.state = patch(internal.state, path, value)
        internal.queue.paths.push(path)
        internal.queue.details.push({name, count: count++, deferred, path})
      }
      if (internal.queue.details.length === 0) setTimeout(() => notify(internal), 0)
      internal.queue.details.push({name, count: -1})
      action(update, ...args)
      setTimeout(() => { deferred = true }, 0)
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
