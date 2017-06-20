/*
  Get value at location described by dot notion path
*/

const invalid = key => !isNaN(key) || key.indexOf('[') !== -1 || key.indexOf(']') !== -1

export const get = (obj, path) => {
  path = path ? path.split('.') : []
  path.some((key, i) => {
    if (invalid(key)) throw Error(`Invalid key '${key}' from path '${path.join('.')}'.`)
    if (Object.prototype.toString.call(obj) !== '[object Object]') throw Error(`Get path '${path.join('.')}' cannot navigate past key '${path[i - 1]}', '${path[i - 1]}' is non-object value '${obj}'.`)
    obj = obj[key]
    return Boolean(obj === undefined) // Stop navigating the path if we get to undefined value
  })
  return obj
}
export default get
