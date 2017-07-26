
import React from 'react'
import icons from './icons'
import color from './color'

import Updates from './Updates'

// let hover = {name: '', count: -1}

export const Actions = ({actions}) => {
  let style = {
    wrap: {},
    action: {
      overflow: 'hidden',
      color: color.text,
      borderRadius: '3px',
      background: 'rgb(55, 59, 66)',
      position: 'relative'
    },
    top: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    name: {
      padding: '5px 5px 5px 40px',
      fontSize: '12px'
    },
    icon: {
      position: 'absolute',
      width: '30px',
      top: '0',
      left: '0',
      bottom: '0',
      background: 'rgb(68, 73, 82)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
  return (
    <div style={style.wrap}>
      {actions.map((action, i) => {
        let actionStyle = i === 0 ? style.action : {...style.action, marginTop: '5px'}
        return (
          <div key={i} style={actionStyle}>
            <div style={style.top}>
              {action.deferred ? (
                <div style={style.icon}>{icons.clock({color: color.text})}</div>
              ) : (
                <div style={style.icon}>{icons.zap({color: color.text})}</div>
              )}
              <div style={style.name}>{action.name}</div>
            </div>
            <Updates updates={action.updates} />
          </div>
        )
      })}
    </div>
  )
}

export default Actions
