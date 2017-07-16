/*
  Make objects read-only
*/

export const update = (obj, key, value) => {
  Object.defineProperty(obj, key, {value: value, writable: false, enumerable: true})
}

export const object = obj => {
  Object.keys(obj).forEach(name => {
    if (typeof obj[name] === 'object') obj[name] = object(obj[name])
    update(obj, name, obj[name])
  })
  return obj
}

export default {update, object}
