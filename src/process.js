/*
  Process all pending observers
*/

import observe from './observe'

export const process = internal => {
  if (internal.observatory.pending.length > 0) {
    observe(internal, internal.observatory.pending.shift())
    process(internal)
  }
}
export default process
