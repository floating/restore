/*
  Observer tracking
*/

const observe = (internal, id, run) => {
  const links = internal.observers[id].links.slice(0)
  internal.observers[id].links = []
  run = run || internal.observers[id].run
  internal.track = id
  const self = { store: internal.store, remove: () => internal.store.api.remove(id) }
  const returned = run.call(self, self.store, self.remove)
  internal.track = null
  // When observer links change, remove them
  if (internal.observers[id]) { // If observer wasn't removed within run call
    links.filter(x => internal.observers[id].links.indexOf(x) < 0).forEach(link => {
      const index = internal.links[link].indexOf(id)
      if (index !== -1) internal.links[link].splice(index, 1)
    })
  }
  return returned
}

export default observe
