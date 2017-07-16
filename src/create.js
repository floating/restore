/*
  Create the store (Restore.create)
*/

import notify from './notify'
import clone from './clone'
import get from './get'
import resolve from './resolve'
import uuid from './uuid'
import observe from './observe'

export const create = (state = {}, actions = {}, options) => {
  let internal = {state: clone.deep(state), queued: false, queue: {normal: [], deferred: []}, watchers: {}, observatory: {track: '', order: [], links: {}, observers: {}, pending: []}}
  const store = (path) => {
    if (internal.observatory.track) {
      let id = internal.observatory.track
      internal.observatory.observers[id].links = internal.observatory.observers[id].links || []
      internal.observatory.links[path] = internal.observatory.links[path] || []
      if (internal.observatory.observers[id].links.indexOf(path) === -1) internal.observatory.observers[id].links.push(path)
      if (internal.observatory.links[path].indexOf(internal.observatory.track) === -1) internal.observatory.links[path].push(internal.observatory.track)
    }
    return get(internal.state, path)
  }
  store.observer = (run, id, alt) => {
    id = id || uuid()
    if (internal.observatory.order.indexOf(id) === -1) internal.observatory.order.push(id)
    internal.observatory.observers[id] = {links: [], run: alt || run}
    return { returned: observe(internal, id, run), remove: () => store.api.remove(id) }
  }
  store.api = {
    getState: () => clone.deep(internal.state),
    replaceState: state => {
      internal.state = state
      notify(internal, '*')
      Object.keys(internal.watchers).forEach(id => internal.watchers[id](internal.state, ['replaceState (internal)'], true)) // Notify all watchers
    },
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
      internal.observatory.observers[id].links.forEach(link => {
        let l = internal.observatory.links[link].indexOf(id)
        if (l > -1) internal.observatory.links[link].splice(l, 1)
      })
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
