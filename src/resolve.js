/*
  Resolves actions passed during create
*/

import clone from './clone'
import get from './get'
import notify from './notify'
import patch from './patch'
import pathway from './pathway'

const record = {}

export const resolve = (internal, action, tree = {}, name) => {
  if (typeof action === 'function') {
    return (...args) => {
      let deferred = false
      let count = record[name] = ++record[name] || 1
      internal.queue.actions.push({name, count, deferred, updates: []})
      if (internal.queue.actions.length === 1) setTimeout(() => notify(internal), 0)
      let update = (...args) => {
        args = [...args]
        let up = args.pop()
        let path = pathway(args) || '*'
        let value = up(clone.deep(path === '*' ? internal.state : get(internal.state, path)), internal.state)
        internal.state = patch(internal.state, path, value)
        internal.queue.paths.push(path)
        let last = internal.queue.actions[internal.queue.actions.length - 1]
        if (last && last.name === name && last.count === count) {
          last.updates.push({path, value})
        } else {
          internal.queue.actions.push({name, count, deferred, updates: [{path, value}]})
          if (internal.queue.actions.length === 1) setTimeout(() => notify(internal), 0)
        }
      }
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
