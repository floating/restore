/*
  Patch objects, updates state with values returned from update methods
*/

import thaw from './thaw'
import freeze from './freeze'
import pathway from './pathway'

export const patch = (obj, path, value) => {
  if (path === '*') return freeze.deep(value)
  path = pathway.split(path)
  obj = thaw.shallow(obj)
  let key = path.shift()
  obj[key] = path.length > 0 ? patch(obj[key], path, value) : freeze.deep(value)
  return freeze.shallow(obj)
}

export default patch
