/*
  Notify observers/watchers
*/

import expand from './expand'
import observe from './observe'

const process = internal => {
  if (internal.pending.length > 0) {
    observe(internal, internal.pending.shift())
    process(internal)
  }
}

export const notify = internal => {
  expand(internal).forEach(target => { internal.pending = internal.pending.concat(internal.links[target]) })
  internal.pending = [...new Set(internal.pending)]
  internal.pending.sort((a, b) => internal.order.indexOf(a) - internal.order.indexOf(b))
  process(internal) // Process all pending observers
  Object.keys(internal.watchers).forEach(id => internal.watchers[id](internal.state, internal.queue.details))
  internal.queue = {paths: [], details: []}
}

export default notify
