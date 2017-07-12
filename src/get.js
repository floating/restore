/*
  Get value at location described by dot notion path
*/

import pathway from './pathway'

export const get = (obj, path) => {
  path = pathway(path)
  path.some((key, i) => {
    if (typeof obj !== 'object') throw Error(`Get path '${path.join('.')}' cannot navigate past key '${path[i - 1]}', '${path[i - 1]}' is non-object value '${obj}'.`)
    obj = obj[key]
    return Boolean(obj === undefined) // Stop navigating the path if we get to undefined value
  })
  return obj
}
export default get
