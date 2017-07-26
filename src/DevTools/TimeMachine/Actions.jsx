
import React from 'react'
import icons from '../icons'

import Updates from './Updates'

export const Actions = ({actions, color}) => {
  let style = {
    actionWrap: {
    },
    action: {
      overflow: 'hidden',
      color: color.text,
      borderRadius: '3px',
      background: color.d,
      position: 'relative'
    },
    top: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    name: {
      padding: '5px 5px 5px 40px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    icon: {
      position: 'absolute',
      width: '30px',
      top: '0',
      left: '0',
      bottom: '0',
      background: '#505e75',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
  return (
    <div style={style.actionWrap}>
      {actions.map((action, i) => {
        style.action.marginTop = i === 0 ? '0px' : '5px'
        return (
          <div key={i} style={style.action}>
            <div style={style.top}>
              {action.deferred ? (
                <div style={style.icon}>{icons.clock({color: color.text})}</div>
              ) : (
                <div style={style.icon}>{icons.zap({color: color.text})}</div>
              )}
              <div style={style.name}>{action.name}</div>
            </div>
            <Updates updates={action.updates} color={color} />
          </div>
        )
      })}
    </div>
  )
}

export default Actions
