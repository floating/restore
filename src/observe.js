/*
  Observer Tracking
*/

const observe = (internal, id, run) => {
  let links = internal.observers[id].links.slice(0)
  internal.observers[id].links = []
  run = run || internal.observers[id].run
  internal.track = id
  let returned = run(internal.store)
  internal.track = null
  // When observer links change, remove them
  links.filter(x => internal.observers[id].links.indexOf(x) < 0).forEach(link => {
    let index = internal.links[link].indexOf(id)
    if (index !== -1) internal.links[link].splice(index, 1)
  })
  return returned
}

export default observe
