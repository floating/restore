/*
  Patch objects, updates state with values returned from update methods
*/

const invalid = key => !isNaN(key) || key.indexOf('[') !== -1 || key.indexOf(']') !== -1

export const patch = (obj, path, value) => {
  if (typeof path === 'string') path = path.split('.')
  if (path.length > 1) {
    let key = path.shift()
    if (invalid(key)) throw Error(`Invalid key "${key}" from path "${path}".`)
    obj[key] = Object.prototype.toString.call(obj[key]) === '[object Object]' ? obj[key] : {}
    patch(obj[key], path, value)
  } else {
    let key = path[0]
    if (invalid(key)) throw Error(`Invalid key "${key}" from path "${path}".`)
    obj[key] = value
  }
}
export default patch
