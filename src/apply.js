/*
  Apply updates to state and notify observers/watchers
*/

import observe from './observe'

export const apply = (internal, actions, paths, i) => {
  internal.observatory.pending = []
  let changes = [...new Set(paths)]
  let targets = []
  let links = Object.keys(internal.observatory.links)
  let match = point => { // Target child links
    links.forEach(link => { if (link.startsWith(point) && targets.indexOf(link) === -1) targets.push(link) })
  }
  let peel = point => { // Target parent links
    if (point) {
      if (internal.observatory.links[point] && targets.indexOf(point) === -1) targets.push(point)
      peel(point.substring(0, point.lastIndexOf('.')))
    }
  }
  if (changes.indexOf('*') > -1) {
    targets = links
  } else {
    changes.forEach(change => {
      match(change)
      peel(change)
    })
  }
  targets.forEach(target => { internal.observatory.pending = internal.observatory.pending.concat(internal.observatory.links[target]) })
  internal.observatory.pending = [...new Set(internal.observatory.pending)]
  internal.observatory.pending.sort((a, b) => internal.observatory.order.indexOf(a) - internal.observatory.order.indexOf(b))
  let process = () => {
    if (internal.observatory.pending.length > 0) {
      let target = internal.observatory.pending.shift()
      observe(internal, target, internal.observatory.observers[target].run)
      process()
    }
  }
  process() // Trigger all targets
  Object.keys(internal.watchers).forEach(id => internal.watchers[id](internal.state, actions, i))
}
export default apply
