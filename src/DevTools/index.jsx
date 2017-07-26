/*
  Time Machine Component
*/

import React from 'react'
import connect from '../connect'

import icons from './icons'
import color from './color'

import Actions from './Actions'
import Details from './Details'

class DevTools extends React.Component {
  constructor (...args) {
    super(...args)
    this.history = [{state: this.context.store(), obs: 0, actions: [{name: 'initialState', count: 0, updates: []}]}]
    this.future = []
    this.state = {expand: true}
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
        padding: '0px 10px 0px 10px'
        // background: '#38344a'
      },
      item: {
        borderRadius: '3px',
        overflow: 'hidden',
        background: 'rgb(48, 52, 58)',
        marginBottom: '10px',
        padding: '0px 5px 0px 5px',
        position: 'relative',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
      },
      marker: {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        width: '30px',
        background: 'rgb(55, 59, 66)',
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      },
      current: {
        background: color.good
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
        color: 'rgb(57, 65, 78)'
      }
    }

    let item = (batch, i, future) => {
      let current = i === this.history.length - 1 && !future
      let travel = () => future ? this.timeTravel(i + 1) : this.timeTravel(i - this.history.length + 1)
      let marker = current ? {...style.marker, ...style.current} : style.marker
      let markerIcon = current ? style.markerIcon : {...style.markerIcon, color: 'white'}
      return (
        <div key={i} style={style.item}>
          <div style={marker} />
          <div style={markerIcon} onClick={travel}>
            <span style={{pointerEvents: 'none'}}>{icons.location({color: markerIcon.color})}</span>
          </div>
          <div style={style.body}>
            {i > 0 || future ? (
              <div style={style.top}>
                <Details batch={batch} />
              </div>
            ) : null}
            {i > 0 || future ? (
              <div style={style.mid}>
                <Actions actions={batch.actions} />
              </div>
            ) : null}
            <div style={style.bot}>
              <div style={style.log} onClick={() => console.log(batch.state)}>{i > 0 || future ? 'Log State' : 'Initial State'}</div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div ref={(scroll) => { if (scroll) this.scroll = scroll }} style={style.timeline}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: '3px',
          height: '70px',
          textTransform: 'uppercase',
          letterSpacing: '12px',
          fontSize: '10px',
          color: 'black'
        }}>
          <div style={{marginBottom: '6px'}}>Restore</div>
          <div>DevTool</div>
        </div>
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
        background: color.back,
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
        <div style={{
          width: '3px',
          background: 'white',
          position: 'absolute',
          top: '0px',
          bottom: '0px',
          left: '-3px'
        }} />
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
        <div style={{display: 'flex', position: 'absolute', background: 'rgba(255,255,255,1)', bottom: '10px', right: '10px', left: '10px', height: '40px', borderRadius: '3px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', zIndex: '30'}}>
          <div onClick={() => { this.timeTravel(-1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', borderRight: '1px solid rgba(0,0,0,0.1)'}}>
            {icons.arrow({color: color.text, direction: 'left'})}
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', textTransform: 'uppercase', height: '40px', width: 'calc(100% - 80px)'}}>{'Time Travel'}</div>
          <div onClick={() => { this.timeTravel(1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', borderLeft: '1px solid rgba(0,0,0,0.1)'}}>
            {icons.arrow({color: color.text, direction: 'right'})}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(DevTools)
