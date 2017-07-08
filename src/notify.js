/*
  Notify observers/watchers
*/

import expand from './expand'
import process from './process'

export const notify = (internal, paths) => {
  expand(internal, paths).forEach(target => { internal.observatory.pending = internal.observatory.pending.concat(internal.observatory.links[target]) })
  internal.observatory.pending = [...new Set(internal.observatory.pending)]
  internal.observatory.pending.sort((a, b) => internal.observatory.order.indexOf(a) - internal.observatory.order.indexOf(b))
  process(internal) // Process all pending observers
}
export default notify
