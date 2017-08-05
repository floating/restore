import React from 'react'

import icons from '../shared/icons'
import color from '../shared/color'
import loadStyle from '../shared/loadStyle'

import style from './style'
import Updates from './Updates'

class Actions extends React.PureComponent {
  componentDidMount () {
    loadStyle(style)
  }
  render () {
    let {actions, name, count, setLink} = this.props
    return (
      <div>
        {actions.map((action, i) => {
          let highlight = name === action.name && count === action.count
          let iconStyle = action.deferred ? (
            highlight ? {background: color.async, fill: color.levelTwo} : {fill: color.async}
          ) : (
            highlight ? {background: color.sync, fill: color.levelTwo} : {fill: color.sync}
          )
          return (
            <div className='__restoreAction' key={i} style={highlight ? {background: color.levelFour} : {}} onMouseEnter={() => setLink(action.name, action.count)} onMouseLeave={() => setLink()}>
              <div className='__restoreActionTop'>
                {action.deferred ? (
                  <div className='__restoreActionIcon' style={iconStyle}>{icons.clock()}</div>
                ) : (
                  <div className='__restoreActionIcon' style={iconStyle}>{icons.zap()}</div>
                )}
                <div className='__restoreActionName'>{action.name}</div>
              </div>
              <Updates updates={action.updates} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Actions
