/*
  Observer Tracking
*/

const observe = (internal, id, run) => {
  let observers = internal.observatory.observers
  let links = observers[id].links.slice(0)
  observers[id].links = []
  run = run || observers[id].run
  internal.observatory.track = id
  let returned = run(internal.store)
  internal.observatory.track = null
  // When observer links change, remove them
  links.filter(x => observers[id].links.indexOf(x) < 0).forEach(link => {
    let links = internal.observatory.links[link]
    let index = links.indexOf(id)
    if (index !== -1) links.splice(index, 1)
  })
  return returned
}

export default observe
