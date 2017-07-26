
import React from 'react'
import icons from '../icons'

export const Details = ({batch, color, index, future, history}) => {
  let style = {
    details: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      fontWeight: 'bold',
      color: color.text
    },
    display: {
      width: '40px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '100%',
      marginRight: '5px'
    },
    icon: {
      padding: '4px 4px 2px 4px'
    },
    count: {
      fontSize: '18px'
    },
    travel: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      flexGrow: 2,
      marginRight: '15px',
      background: color.d,
      borderRadius: '3px',
      height: '30px'
    },
    log: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      flexGrow: 2,
      marginLeft: '15px',
      background: color.d,
      borderRadius: '3px',
      height: '30px'
    },
    current: {
      background: color.good
    }
  }

  let actionCount = (batch.actions.filter(a => !a.deferred)).length
  let updateCount = 0
  batch.actions.forEach(action => { updateCount += action.updates.length })
  let observerCount = batch.obs
  let current = index === history.length - 1 && !future
  let travel = () => {
    if (future) {
      this.timeTravel(index + 1)
    } else {
      this.timeTravel(index - history.length + 1)
    }
  }
  return (
    <div style={style.details}>
      <div style={style.display} title={'Actions'}>
        <div style={style.icon}>{icons.radio({color: color.text})}</div>
        <div style={style.count}>{actionCount}</div>
      </div>
      <div style={style.display} title={'Updates'}>
        <div style={style.icon}>{icons.merge({color: color.text})}</div>
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
