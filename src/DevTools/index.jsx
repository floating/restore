/*
  DevTools Component
*/

import React from 'react'
import connect from '../connect'

import icons from './icons'
import color from './color'

import Actions from './Actions'
import Details from './Details'

import fira from './fira'

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
        if (this.scroll) this.scroll.scrollTop = this.scroll.scrollHeight
        this.forceUpdate()
      }
    })
  }
  componentDidMount () {
    let fontCode = `@font-face {font-family: 'fira'; src: url('data:application/font-woff;base64,${fira}') format('woff'); font-style: normal; font-weight: normal}`
    let style = document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = fontCode
    } else {
      style.innerHTML = fontCode
    }
    document.head.appendChild(style)
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
  logState (state) {
    return e => {
      e.stopPropagation()
      console.log(state)
    }
  }
  renderTimeline () {
    let style = {
      timeline: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '30px',
        fontSize: '14px',
        overflow: 'scroll',
        padding: '5px 5px 0px 5px'
        // background: '#38344a'
      },
      item: {
        // borderRadius: '3px',
        overflow: 'hidden',
        background: color.levelTwo,
        marginBottom: '5px',
        padding: '0px 5px 0px 5px',
        position: 'relative',
        fill: color.text
        // boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
      },
      marker: {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        width: '30px',
        background: color.levelThree,
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      },
      current: {
        background: color.highlight
      },
      body: {
        marginLeft: '10px',
        position: 'relative',
        zIndex: 1
      },
      top: {
        height: '30px'
      },
      mid: {

      },
      bot: {
        height: '30px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      log: {
        textTransform: 'uppercase',
        fontSize: '10px',
        paddingRight: '2px',
        paddingTop: '0px',
        cursor: 'pointer'
      },
      markerIcon: {
        position: 'absolute',
        left: '0px',
        bottom: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        cursor: 'pointer',
        color: color.text,
        paddingTop: '3px',
        boxSizing: 'border-box'
      }
    }

    let item = (batch, i, future) => {
      let current = i === this.history.length - 1 && !future
      let travel = () => future ? this.timeTravel(i + 1) : this.timeTravel(i - this.history.length + 1)
      let marker = current ? {...style.marker, ...style.current} : style.marker
      let markerIcon = current ? {...style.markerIcon, color: color.levelThree, fill: color.levelThree} : style.markerIcon
      return (
        <div key={i} style={style.item}>
          <div style={marker} />
          <div style={markerIcon} onClick={travel}>
            <span style={{pointerEvents: 'none'}}>{icons.location()}</span>
          </div>
          <div style={style.body}>
            {i > 0 || future ? (
              <div style={style.top}>
                <Details batch={batch} />
              </div>
            ) : null}
            {i > 0 || future ? (
              <div style={style.mid}>
                <Actions actions={batch.actions} name={this.state.name} count={this.state.count} setLink={this.setLink} />
              </div>
            ) : null}
            <div style={style.bot}>
              <div style={style.log} onClick={() => console.log(batch.state)}>{i > 0 || future ? 'Log State' : 'Initial State'}</div>
            </div>
          </div>
        </div>
      )
    }
    /*
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: '3px',
      height: '50px',
      textTransform: 'uppercase',
      letterSpacing: '12px',
      fontSize: '10px',
      color: 'black'
    }}>
      <div>Restore DevTools</div>
    </div>

    <div style={{
      width: '3px',
      background: 'white',
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '-3px'
    }} />
    */
    return (
      <div ref={(scroll) => { if (scroll) this.scroll = scroll }} style={style.timeline}>
        {this.history.map((batch, i) => item(batch, i, false))}
        {this.future.map((batch, i) => item(batch, i, true))}
        <div style={{width: '100%', height: '50px'}} />
      </div>
    )
  }
  render () {
    let style = {
      timeMachine: {
        position: 'fixed',
        width: '340px',
        top: '0px',
        right: this.state.expand ? '0px' : '-344px',
        bottom: '0px',
        background: color.levelOne,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        transition: '0.4s all cubic-bezier(0.85, 0, 0.15, 1)',
        color: color.text,
        fontWeight: 'normal',
        zIndex: '99999999'
      }
    }
    return (
      <div style={style.timeMachine}>
        {this.renderTimeline()}
        <div onClick={() => { this.setState({expand: !this.state.expand}) }} style={{
          position: 'absolute',
          height: '44px',
          width: '44px',
          borderRadius: '22px',
          background: 'white',
          cursor: 'pointer',
          bottom: '50%',
          left: '-52px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '2'
        }}>
          <div style={{
            height: '38px',
            width: '38px',
            borderRadius: '19px',
            background: color.back,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0px 0px 2px 2px'
          }}>
            {icons.beaker({color: 'white'})}
          </div>
        </div>
        <div style={{display: 'flex', position: 'absolute', color: color.text, fill: color.text, background: color.levelThree, bottom: '5px', right: '5px', left: '5px', height: '30px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', zIndex: '30'}}>
          <div onClick={() => { this.timeTravel(-1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', width: '30px', minWidth: '30px', background: color.levelFour, cursor: 'pointer'}}>
            {icons.arrow({direction: 'left'})}
          </div>
          <div onClick={() => { this.timeTravel(1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1px', height: '30px', width: '30px', minWidth: '30px', background: color.levelFour, cursor: 'pointer'}}>
            {icons.arrow({direction: 'right'})}
          </div>
          <div style={{
              textTransform: 'uppercase',
              width: '100%',
              fontSize: '8px',
              letterSpacing: '5px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              color: 'rgba(0,0,0,0.9)',
              userSelect: 'none',
              margin: '4px 0px 2px 2px',
              lineHeight: '11px'
            }}>
            Restore<br />DevTool
          </div>
        </div>
      </div>
    )
  }
}

export default connect(DevTools)
