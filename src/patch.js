/*
  Patch objects, updates state with values returned from update methods
*/

import clone from './clone'
import pathway from './pathway'
import safe from './safe'

export const patch = (obj, path, value, s) => {
  path = s ? path : pathway(path)
  obj = clone.shallow(obj)
  if (path.length > 1) {
    let key = path.shift()
    value = patch(obj[key], path, value, true)
    safe.update(obj, key, value)
  } else {
    let key = path[0]
    if (typeof value === 'object' && value !== null) value = clone.shallow(safe.object(value))
    safe.update(obj, key, value)
  }
  return obj
}

export default patch
