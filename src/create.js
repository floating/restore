/*
  Create the store (Restore.create)
*/

import apply from './apply'
import clone from './clone'
import get from './get'
import resolve from './resolve'
import uuid from './uuid'

export const create = (state = {}, actions = {}, options) => {
  let internal = {state: clone(state), queued: false, queue: {normal: [], deferred: []}, watchers: {}, observatory: {track: '', order: [], links: {}, observers: {}, pending: []}}
  const store = (path) => {
    if (internal.observatory.track) {
      internal.observatory.links[path] = internal.observatory.links[path] || []
      if (internal.observatory.links[path].indexOf(internal.observatory.track) === -1) internal.observatory.links[path].push(internal.observatory.track)
    }
    return get(internal.state, path)
  }
  store.observer = (run, id, alt) => {
    id = id || uuid()
    internal.observatory.track = id
    if (internal.observatory.order.indexOf(internal.observatory.track) === -1) internal.observatory.order.push(internal.observatory.track)
    internal.observatory.observers[internal.observatory.track] = alt || run
    let returned = run()
    internal.observatory.track = null
    return { returned, remove: () => delete internal.observatory.observers[id] }
  }
  store.api = {
    getState: () => clone(internal.state),
    replaceState: state => apply(internal, state, ['replaceState (internal)'], '*', true),
    feed: watcher => {
      let id = uuid()
      internal.watchers[id] = watcher
      return { remove: () => delete internal.watchers[id] }
    },
    remove: id => {
      let p = internal.observatory.pending.indexOf(id)
      if (p > -1) internal.observatory.pending.splice(p, 1)
      let o = internal.observatory.order.indexOf(id)
      if (o > -1) internal.observatory.order.splice(o, 1)
      delete internal.observatory.observers[id]
    },
    report: id => {
      let i = internal.observatory.pending.indexOf(id)
      if (i > -1) internal.observatory.pending.splice(i, 1)
    }
  }
  Object.keys(store.api).forEach(method => { if (actions[method]) throw new Error(`[Restore] API method name ${method} is reserved.`) })
  Object.assign(store, resolve(internal, actions))
  internal.store = store
  return store
}
export default create
