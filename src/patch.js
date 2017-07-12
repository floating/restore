/*
  Patch objects, updates state with values returned from update methods
*/

import clone from './clone'
import pathway from './pathway'

export const patch = (obj, path, value, s) => {
  path = s ? path : pathway(path)
  if (path.length > 1) {
    let key = path.shift()
    obj[key] = clone.shallow(obj[key])
    patch(obj[key], path, value, true)
  } else {
    obj[path[0]] = value
  }
}
export default patch
