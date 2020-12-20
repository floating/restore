/*
  Thaw objects
*/

export const shallow = o => {
  if (!o) return {}
  if (Object.prototype.toString.call(o) === '[object Object]') return Object.assign({}, o)
  if (Object.prototype.toString.call(o) === '[object Array]') return o.slice(0)
}

export const deep = o => {
  let n, i
  if (typeof o !== 'object') return o
  if (!o) return o
  if (o.constructor === Array) {
    n = []
    for (i = 0; i < o.length; i++) n[i] = deep(o[i])
    return n
  }
  n = {}
  for (i in o) n[i] = deep(o[i])
  return n
}

export default { deep, shallow }
