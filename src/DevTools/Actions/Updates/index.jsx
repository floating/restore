
import React from 'react'
import icons from '../../icons'

const stringLength = 14
const displayPath = (path) => {
  if (path.length > stringLength) path = '...' + path.substring(path.length - stringLength, path.length)
  return path
}
const displayValue = (value) => {
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
export const Updates = ({updates}) => {
  let style = {
    update: {},
    updatePath: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      whitespace: 'nowrap',
      overflow: 'hidden',
      fontFamily: 'fira, monospace',
      padding: '0px 5px 6px 45px',
      fontSize: '10px',
      cursor: 'pointer'
    },
    icon: {
      marginRight: '7px',
      height: '8px',
      marginTop: '-4px'
    }

  }
  return (
    <div>
      {updates.map((update, i) => {
        return (
          <div key={i} style={style.update}>
            <div style={style.updatePath} onClick={(e) => logUpdate(update.path, update.value)}>
              <span style={style.icon}>{icons.mergeSmall()}</span>
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

export default Updates
