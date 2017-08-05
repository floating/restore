import React from 'react'

import icons from '../../shared/icons'
import loadStyle from '../../shared/loadStyle'

import style from './style'

const stringLength = 14

const displayPath = path => {
  if (path.length > stringLength) path = '...' + path.substring(path.length - stringLength, path.length)
  return path
}

const displayValue = value => {
  if (value !== undefined && value !== null) {
    if (value.constructor === Object) {
      value = 'Object(' + Object.keys(value).length + ')'
    } else if (value.constructor === Array) {
      value = 'Array(' + value.length + ')'
    } else {
      value = JSON.stringify(value)
      if (value.length > stringLength) value = value.substring(0, stringLength) + '...'
    }
  }
  return value
}

const logUpdate = (path, value) => {
  console.log(' ')
  console.log('Updated Path: ' + path)
  console.log(value)
  console.log(' ')
}

class Updates extends React.PureComponent {
  componentDidMount () {
    loadStyle(style)
  }
  render () {
    let {updates} = this.props
    return (
      <div>
        {updates.map((update, i) => {
          return (
            <div key={i}>
              <div className='__restoreUpdatePath' onClick={(e) => logUpdate(update.path, update.value)}>
                <span className='__restoreUpdateIcon'>{icons.mergeSmall()}</span>
                <span>{displayPath(update.path)}</span>
                <span>&nbsp;===&nbsp;</span>
                <span style={{fontWeight: 'bold'}}>{displayValue(update.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Updates
