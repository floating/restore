/*
  Resolves actions passed during create
*/

import apply from './apply'
import clone from './clone'
import get from './get'
import patch from './patch'

export const resolve = (internal, action, tree = {}, name) => {
  if (typeof action === 'function') {
    return (...args) => {
      let count = 0
      let deferred = false
      let update = (path = false, up) => {
        if (typeof path === 'function') {
          up = path
          path = false
        }
        internal.queue[deferred ? 'deferred' : 'normal'].push({update: up, path: path, details: {name: name, count: count++, deferred: deferred}})
        if (!internal.queued) {
          setTimeout(() => {
            deferred = true
            internal.queued = false
            let actions = []
            let paths = []
            internal.queue.normal.concat(internal.queue.deferred).forEach(action => {
              actions.push(action.details)
              if (action.path) {
                paths.push(action.path)
                let part = get(internal.state, action.path)
                patch(internal.state, action.path, action.update(clone(part), internal.state))
              } else {
                paths.push('*')
                internal.state = action.update(internal.state, internal.state)
              }
            })
            internal.queue = {normal: [], deferred: []}
            apply(internal, actions, paths)
          }, 0)
          internal.queued = true
        } else {
          setTimeout(() => { deferred = true }, 0)
        }
      }
      action(update, ...args)
      return internal.store
    }
  } else if (typeof action === 'object') {
    Object.keys(action).forEach((name) => { tree[name] = resolve(internal, action[name], tree[name], name) })
  } else {
    throw new Error(`[Restore] Invlaid entry in action tree: '${name}' is a ${typeof action}.`)
  }
  return tree
}
export default resolve
