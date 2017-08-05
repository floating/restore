let isNode = (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined')

let style = css => {
  if (isNode) return
  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  head.appendChild(style)
}

export default style
