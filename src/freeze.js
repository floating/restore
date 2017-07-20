/*
  Freeze objects
*/

export const shallow = o => Object.freeze(o)

export const deep = o => {
  if (typeof o === 'object' && o !== null) Object.keys(o).forEach(k => deep(o[k]))
  return shallow(o)
}

export default {deep, shallow}
