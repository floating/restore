/*
  Connect React components (Restore.connect)
*/

import React from 'react'
import uuid from './uuid'

const isRequired = (props, propName, componentName) => {
  if (props[propName] === undefined || props[propName] === null) return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.')
}

export const connect = (Component, store) => {
  // Avoid double connect
  Component = Component._restoreOrigin || Component

  // Wrap Stateless Components
  if (typeof Component === 'function' && (!Component.prototype || !Component.prototype.render) && !Component.isReactClass && !React.Component.isPrototypeOf(Component)) {
    let statelessRender = Component
    class Stateless extends React.Component { render () { return statelessRender.call(this, this.props, this.context) } }
    Stateless.displayName = Component.displayName || Component.name
    Stateless.propTypes = Component.propTypes
    Stateless.contextTypes = Component.contextTypes
    Stateless.defaultProps = Component.defaultProps
    Component = Stateless
  }

  // Create Connected Component
  class Connected extends Component {
    constructor (...args) {
      super(...args)
      this.restoreIdentity = uuid()
      this.store = store || this.context.store
    }
    getChildContext () {
      let childContext = store ? {store, restoreParent: this.restoreIdentity} : {restoreParent: this.restoreIdentity}
      if (super.getChildContext) childContext = Object.assign({}, super.getChildContext(), childContext)
      return childContext
    }
    componentWillUnmount () {
      this.store.api.remove(this.restoreIdentity)
      if (super.componentWillUnmount) super.componentWillUnmount()
    }
    render (...args) {
      let observer = this.store.observer(super.render.bind(this, ...args), this.restoreIdentity, () => this.forceUpdate())
      this.store.api.report(this.restoreIdentity)
      return observer.returned
    }
  }
  Connected.childContextTypes = Connected.childContextTypes || {}
  Connected.childContextTypes.restoreParent = isRequired
  let type = store ? 'childContextTypes' : 'contextTypes'
  Connected[type] = Connected[type] || {}
  Connected[type].restoreParent = isRequired
  Connected[type].store = isRequired
  Connected.displayName = Component.displayName || Component.name || 'Component'
  Connected._restoreOrigin = Component
  return Connected
}

export default connect
