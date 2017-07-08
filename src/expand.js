/*
  Expand targeted paths to all affected paths
*/

export const expand = (internal, paths) => {
  let targets = []
  let links = Object.keys(internal.observatory.links)
  if (paths.indexOf('*') !== -1) {
    return links // Target all observers
  } else {
    paths = [...new Set(paths)]
    let peel = point => {
      if (point) {
        if (internal.observatory.links[point] && targets.indexOf(point) === -1) targets.push(point)
        peel(point.substring(0, point.lastIndexOf('.')))
      }
    }
    paths.forEach(path => {
      links.forEach(link => { if (link.startsWith(path) && targets.indexOf(link) === -1) targets.push(link) }) // Target child link
      peel(path) // Target parent links
    })
    return targets
  }
}
export default expand
