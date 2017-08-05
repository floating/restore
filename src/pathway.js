/*
  Normalize dot/bracket notation paths
*/

const way = path => path.replace(/]\[|]|\[|]/g, '.').replace(/"|'|^\.+|\.+$/g, '')

export const pathway = path => {
  if (!path) return ''
  if (path.constructor === Array) return way(path.join('.'))
  if (path.constructor === String) return way(path)
  throw new Error('[Restore] Pathway Error')
}

pathway.split = path => {
  if (!path) return []
  if (path.constructor === Array) return path
  return path.split('.')
}

export default pathway
