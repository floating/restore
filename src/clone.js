/*
  Clone JSON objects
*/

export const clone = o => {
  let n, i
  if (typeof o !== 'object') return o
  if (!o) return o
  if (o.constructor === Array) {
    n = []
    for (i = 0; i < o.length; i++) n[i] = clone(o[i])
    return n
  }
  n = {}
  for (i in o) n[i] = clone(o[i])
  return n
}
export default clone
