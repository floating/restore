
import React from 'react'
import icons from '../icons'
import color from '../color'

export const Details = ({batch}) => {
  let style = {
    details: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      color: color.text
    },
    display: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '100%',
      marginLeft: '8px',
      marginRight: '2px'
    },
    icon: {
      padding: '4px 4px 2px 4px'
    },
    count: {
      fontSize: '16px'
    }
  }
  let actionCount = (batch.actions.filter(a => !a.deferred)).length
  let updateCount = 0
  batch.actions.forEach(action => { updateCount += action.updates.length })
  let observerCount = batch.obs
  return (
    <div style={style.details}>
      <div style={style.display} title={'Actions'}>
        <div style={style.icon}>{icons.radio({color: color.text})}</div>
        <div style={style.count}>{actionCount}</div>
      </div>
      <div style={style.display} title={'Updates'}>
        <div style={{...style.icon, paddingLeft: '6px'}}>{icons.merge({color: color.text})}</div>
        <div style={style.count}>{updateCount}</div>
      </div>
      <div style={style.display} title={'Observers'}>
        <div style={style.icon}>{icons.telescope({color: color.text})}</div>
        <div style={style.count}>{observerCount}</div>
      </div>
    </div>
  )
}

export default Details
