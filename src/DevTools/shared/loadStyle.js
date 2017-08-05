export const loadStyle = css => {
  if (typeof window !== 'undefined' && window.document && window.document.createElement) {
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
}

export default loadStyle
