/*
  Expand targeted paths to all affected paths
*/

export const expand = (internal) => {
  const links = Object.keys(internal.links)
  let paths = internal.queue.paths
  if (paths.indexOf('*') !== -1) return links // Target all observers
  paths.push('*')
  const targets = []
  paths = [...new Set(paths)]
  const peel = point => {
    if (point) {
      if (internal.links[point] && targets.indexOf(point) === -1) targets.push(point)
      peel(point.substring(0, point.lastIndexOf('.')))
    }
  }
  paths.forEach(path => {
    links.forEach(link => { if (link.startsWith(path) && targets.indexOf(link) === -1) targets.push(link) }) // Target child link
    peel(path) // Target parent links
  })
  return targets
}

export default expand
