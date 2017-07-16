/*
  Make objects read-only
*/

export const update = (obj, key, value) => {
  Object.defineProperty(obj, key, {value: value, writable: false, enumerable: true})
}

export const object = obj => {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(name => {
      update(obj, name, typeof obj[name] === 'object' ? object(obj[name]) : obj[name])
    })
  }
  return obj
}

export default {update, object}
