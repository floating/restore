/*
  Normalize dot/bracket notation paths
*/

const way = (path) => path.replace(/]\[|]|\[|]/g, '.').replace(/"|'|^\.+|\.+$/g, '')

export const pathway = (path) => {
  if (arguments.length === 0) return '*' // Handle case when no argument is passed
  if (path === undefined || path === null) return undefined // Handle undefined path
  if (Array.isArray(path)) {
    if (path.length === 0) return '*'
    if (path.includes(undefined) || path.includes(null)) return undefined
    return way(path.join('.'))
  }
  if (typeof path === 'string') return way(path) // Handle string path
  throw new Error('[Restore] Pathway Error') // If path is neither an array nor a string, throw an error
}

pathway.split = (path) => {
  if (!path || path === '*') return []
  if (path.constructor === Array) return path
  return path.split('.')
}

export default pathway
