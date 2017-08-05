/*
  DevTools Component
*/

import React from 'react'
import connect from '../connect'

import icons from './shared/icons'

import Actions from './Actions'
import Details from './Details'

import './style'

class DevTools extends React.Component {
  constructor (...args) {
    super(...args)
    this.history = [{state: this.context.store(), obs: 0, actions: [{name: 'initialState', count: 0, updates: []}]}]
    this.future = []
    this.state = {expand: true, name: '', count: 0}
  }
  setLink = (name, count) => {
    this.setState({name, count})
  }
  ordinal (n) {
    let s = ['th', 'st', 'nd', 'rd']
    let v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }
  componentWillMount () {
    this.store.api.feed((state, actions, obs) => {
      actions = actions.filter(a => !a.internal)
      if (actions.length > 0) {
        this.history.push({state, actions, obs})
        this.future = []
        this.forceUpdate()
        if (this.scroll) this.scroll.scrollTop = this.scroll.scrollHeight
      }
    })
  }
  timeTravel (travel) {
    if (travel > 0) {
      this.history = [...this.history, ...this.future.splice(0, travel)]
    } else if (travel < 0 && this.history.length > 1) {
      this.future = [...this.history.splice(travel), ...this.future]
    }
    this.store.api.replaceState(this.history[this.history.length - 1].state)
    this.forceUpdate()
  }
  renderTimeline () {
    let item = (batch, i, future) => {
      let current = i === this.history.length - 1 && !future
      let travel = () => future ? this.timeTravel(i + 1) : this.timeTravel(i - this.history.length + 1)
      let markerClass = current ? '__restoreMarker __restoreMarkerCurrent' : '__restoreMarker'
      let marketIconClass = current ? '__restoreMarkerIcon __restoreMarkerIconCurrent' : '__restoreMarkerIcon'
      return (
        <div key={i} className='__restoreItem'>
          <div className={markerClass} />
          <div className={marketIconClass} onClick={travel}>
            <span style={{pointerEvents: 'none'}}>{icons.location()}</span>
          </div>
          <div className='__restoreTimelineBody'>
            {i > 0 || future ? <div className='__restoreTimelineBodyTop'>
              <Details batch={batch} />
            </div> : null}
            {i > 0 || future ? <div>
              <Actions actions={batch.actions} name={this.state.name} count={this.state.count} setLink={this.setLink} />
            </div> : null}
            <div className='__restoreTimelineBodyBot'>
              <div className='__restoreTimelineBodyBotLog' onClick={() => console.log(batch.state)}>{i > 0 || future ? 'Log State' : 'Initial State'}</div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div ref={scroll => { if (scroll) this.scroll = scroll }} className='__restoreTimeline'>
        {this.history.map((batch, i) => item(batch, i, false))}
        {this.future.map((batch, i) => item(batch, i, true))}
        <div style={{width: '100%', height: '5px'}} />
      </div>
    )
  }
  render () {
    return (
      <div className={this.state.expand ? '__restoreTimeMachine __restoreTimeMachineExpanded' : '__restoreTimeMachine'}>
        {this.renderTimeline()}
        <div className='__restoreDevToolsExpand' onClick={() => { this.setState({expand: !this.state.expand}) }}>
          <div className='__restoreDevToolsIcon'>{icons.beaker()}</div>
        </div>
        <div className='__restoreDevToolsMenu'>
          <div className='__restoreMenuBack' onClick={() => { this.timeTravel(-1) }}>{icons.arrow({direction: 'left'})}</div>
          <div className='__restoreMenuForward' onClick={() => { this.timeTravel(1) }}>{icons.arrow({direction: 'right'})}</div>
        </div>
      </div>
    )
  }
}

export default connect(DevTools)
