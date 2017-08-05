import React from 'react'

import icons from '../shared/icons'
import color from '../shared/color'
import loadStyle from '../shared/loadStyle'

import style from './style'

class Details extends React.PureComponent {
  componentDidMount () {
    loadStyle(style)
  }
  render () {
    let actionCount = (this.props.batch.actions.filter(a => !a.deferred)).length
    let updateCount = 0
    this.props.batch.actions.forEach(action => { updateCount += action.updates.length })
    let observerCount = this.props.batch.obs
    return (
      <div className='__restoreDetails'>
        <div className='__restoreDisplay' title='Actions'>
          <div className='__restoreDisplayIcon'>{icons.radio({color: color.text})}</div>
          <div className='__restoreDisplayCount'>{actionCount}</div>
        </div>
        <div className='__restoreDisplay' title='Updates'>
          <div className='__restoreDisplayIcon' style={{paddingLeft: '6px'}}>{icons.merge({color: color.text})}</div>
          <div className='__restoreDisplayCount'>{updateCount}</div>
        </div>
        <div className='__restoreDisplay' title='Observers'>
          <div className='__restoreDisplayIcon'>{icons.telescope({color: color.text})}</div>
          <div className='__restoreDisplayCount'>{observerCount}</div>
        </div>
      </div>
    )
  }
}

export default Details
