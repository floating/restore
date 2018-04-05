/*
  Create the store (Restore.create)
*/

import freeze from './freeze'
import get from './get'
import notify from './notify'
import observe from './observe'
import pathway from './pathway'
import resolve from './resolve'
import uuid from './uuid'

export const create = (state = {}, actions = {}, options) => {
  const internal = {
    state: freeze.deep(state),
    queue: {paths: [], actions: []},
    watchers: {},
    track: '',
    order: [],
    links: {},
    observers: {},
    pending: [],
    count: {}
  }
  const store = (...args) => {
    let path = pathway([...args])
    if (internal.track) {
      let id = internal.track
      internal.observers[id].links = internal.observers[id].links || []
      internal.links[path] = internal.links[path] || []
      if (internal.observers[id].links.indexOf(path) === -1) internal.observers[id].links.push(path)
      if (internal.links[path].indexOf(internal.track) === -1) internal.links[path].push(internal.track)
    }
    return get(internal.state, path)
  }
  store.observer = (run, id, alt) => {
    id = id || uuid()
    if (internal.order.indexOf(id) === -1) internal.order.push(id)
    internal.observers[id] = {links: internal.observers[id] ? internal.observers[id].links : [], run: alt || run}
    return {returned: observe(internal, id, run), remove: () => store.api.remove(id)}
  }
  store.api = {
    replaceState: state => {
      state = freeze.deep(state)
      internal.queue.paths.push('*')
      internal.queue.actions.push({name: 'api.replaceState', count: 0, internal: true, updates: [{path: '*', value: state}]})
      internal.state = state
      notify(internal)
    },
    feed: watcher => {
      let id = uuid()
      internal.watchers[id] = watcher
      return { remove: () => delete internal.watchers[id] }
    },
    remove: id => {
      let p = internal.pending.indexOf(id)
      if (p > -1) internal.pending.splice(p, 1)
      let o = internal.order.indexOf(id)
      if (o > -1) internal.order.splice(o, 1)
      internal.observers[id].links.forEach(link => {
        let l = internal.links[link].indexOf(id)
        if (l > -1) internal.links[link].splice(l, 1)
      })
      delete internal.observers[id]
    },
    report: id => {
      let i = internal.pending.indexOf(id)
      if (i > -1) internal.pending.splice(i, 1)
    }
  }
  Object.keys(store.api).forEach(method => { if (actions[method]) throw new Error(`[Restore] API method name ${method} is reserved.`) })
  Object.assign(store, resolve(internal, actions))
  internal.store = store
  return store
}
export default create
