/*
  Apply updates to state and notify observers/watchers
*/

export const apply = (internal, state, actions, paths, i) => {
  internal.state = state
  internal.observatory.pending = []
  let changes = [...new Set(paths)]
  let targets = [] // Targets will be populatate with all the state paths that have been updated
  let links = Object.keys(internal.observatory.links)
  if (changes.indexOf('*') > -1) {
    targets = links
  } else {
    changes.forEach(change => {
      // Target child links
      links.forEach(link => { if (link.startsWith(change) && targets.indexOf(link) === -1) targets.push(link) })
      // Target parent links
      let peel = point => {
        if (point) {
          if (internal.observatory.links[point] && targets.indexOf(point) === -1) targets.push(point)
          peel(point.substring(0, point.lastIndexOf('.')))
        }
      }
      peel(change)
    })
  }
  targets.forEach(target => { internal.observatory.pending = internal.observatory.pending.concat(internal.observatory.links[target]) })
  internal.observatory.pending = [...new Set(internal.observatory.pending)]
  internal.observatory.pending.sort((a, b) => internal.observatory.order.indexOf(a) - internal.observatory.order.indexOf(b))
  let process = () => {
    if (internal.observatory.pending.length > 0) {
      let target = internal.observatory.pending.shift()
      if (internal.observatory.observers[target]) internal.observatory.observers[target]()
      process()
    }
  }
  process() // Trigger all targets
  Object.keys(internal.watchers).forEach(id => internal.watchers[id](state, actions, i))
}
export default apply
