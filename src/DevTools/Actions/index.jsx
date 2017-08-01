
import React from 'react'
import icons from '../icons'
import color from '../color'
import style from '../style'

import Updates from './Updates'

style(`
  .__restoreAction {
    overflow: hidden;
    color: ${color.tex};
    background: ${color.levelThree};
    position: relative;
  }
`)
export const Actions = ({actions, name, count, setLink}) => {
  let style = {
    actionStyle: {
      overflow: 'hidden',
      color: color.text,
      background: color.levelThree,
      position: 'relative'
    },
    top: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      pointerEvents: 'none'
    },
    name: {
      padding: '5px 0px 5px 35px',
      fontSize: '12px',
      fontFamily: 'fira, monospace',
      pointerEvents: 'none'
    },
    icon: {
      position: 'absolute',
      width: '30px',
      top: '0',
      left: '0',
      bottom: '0',
      background: color.levelFour,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fill: color.text,
      pointerEvents: 'none'
    }
  }
  return (
    <div style={style.wrap}>
      {actions.map((action, i) => {
        let highlight = name === action.name && count === action.count
        let actionStyle = i === 0 ? style.action : {...style.action, marginTop: '1px'}
        actionStyle = highlight ? {...actionStyle, background: color.levelFour} : actionStyle
        let iconStyle = style.icon
        if (action.deferred) {
          iconStyle = highlight ? {...iconStyle, background: color.async, fill: color.levelTwo} : {...iconStyle, fill: color.async}
        } else {
          iconStyle = highlight ? {...iconStyle, background: color.sync, fill: color.levelTwo} : {...iconStyle, fill: color.sync}
        }
        return (
          <div key={i} style={actionStyle} className='__restoreAction' onMouseEnter={() => setLink(action.name, action.count)} onMouseLeave={() => setLink()}>
            <div style={style.top}>
              {action.deferred ? (
                <div style={iconStyle}>{icons.clock()}</div>
              ) : (
                <div style={iconStyle}>{icons.zap()}</div>
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
