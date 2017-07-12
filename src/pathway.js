/*
  Convert dot/bracket notation paths to key array
*/

export const pathway = path => {
  if (!path) return []
  if (path.constructor === Array) return path
  if (typeof path === 'string') return path.replace(/]\[|]|\[|]/g, '.').replace(/"|'|^\.+|\.+$/g, '').split('.')
  throw new Error('Invalid Path')
}
export default pathway
