/*
  Time Machine Component
*/

import React from 'react'
import connect from '../../connect'

class TimeMachine extends React.Component {
  constructor (...args) {
    super(...args)
    this.history = [{actions: [{name: 'initialState', count: 0, deferred: false}], state: this.context.store.api.getState()}]
    this.future = []
    this.state = {expand: false}
  }
  ordinal (n) {
    let s = ['th', 'st', 'nd', 'rd']
    let v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }
  componentWillMount () {
    this.store.api.feed((state, actions, internal) => {
      if (!internal) {
        this.history.push({actions, state})
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
  actionsToName (actions) {
    return actions.map(action => action.name + (action.count ? ` (${this.ordinal(action.count + 1)} Update)` : '') + (action.deferred ? ' [deferred]' : '')).join(' > ')
  }
  logState (state) {
    return e => {
      e.stopPropagation()
      console.log(state)
    }
  }
  render () {
    return (
      <div style={{cursor: 'pointer', position: 'fixed', width: '300px', top: '0px', right: this.state.expand ? '0px' : '-303px', bottom: '0px', background: 'linear-gradient(45deg, rgb(168, 113, 255) 0%, #5e2fed 100%)', fontSize: '14px', fontFamily: 'sans-serif', transition: '0.4s all cubic-bezier(0.85, 0, 0.15, 1)', color: '#5e2fed', boxShadow: 'inset 0px 1px 3px rgba(0,0,150,0.3)', zIndex: '99999999'}}>
        <div ref={(scroll) => { if (scroll) this.scroll = scroll }} style={{cursor: 'pointer', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '30px', fontSize: '14px', fontFamily: 'sans-serif', overflow: 'scroll', padding: '0px 10px 0px 10px'}}>
          {this.history.map((s, i) => {
            return (
              <div onClick={() => { this.timeTravel(i - this.history.length + 1) }} key={Math.random()} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '40px', marginTop: '10px', borderRadius: '3px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', background: this.history.length - 1 === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)'}}>
                <div style={{margin: '10px'}}>{this.actionsToName(s.actions)}</div>
                <div style={{margin: '10px', borderRadius: '3px', padding: '4px 6px', fontSize: '11px', cursor: 'pointer', zIndex: '20', border: '1px solid rgba(0,0,0,0.1)', whiteSpace: 'nowrap'}} onClick={this.logState(s.state)}>Log State</div>
              </div>
            )
          })}
          {this.future.map((s, i) => {
            return (
              <div onClick={() => { this.timeTravel(i + 1) }} key={Math.random()} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '40px', marginTop: '10px', borderRadius: '3px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', background: 'rgba(255,255,255,0.8)'}}>
                <div style={{margin: '10px'}}>{this.actionsToName(s.actions)}</div>
                <div style={{margin: '10px', borderRadius: '3px', padding: '4px 6px', fontSize: '11px', cursor: 'pointer', zIndex: '20', border: '1px solid rgba(0,0,0,0.1)', whiteSpace: 'nowrap'}} onClick={this.logState(s.state)}>Log State</div>
              </div>
            )
          })}
          <div style={{width: '100%', height: '50px'}} />
        </div>
        <div onClick={() => { this.setState({expand: !this.state.expand}) }} style={{position: 'absolute', borderRadius: '50%', background: '#f7f7f7', border: '3px solid rgba(255,255,255,1)', bottom: '50%', left: '-54px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)'}}>
          <div style={{height: '36px', width: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, rgb(168, 113, 255) 0%, #5e2fed 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <svg width='16px' height='24px' viewBox='0 0 12 16' version='1.1'>
              <g id='Octicons' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='watch' fill='#f7f7f7'>
                  <path d='M6,8 L8,8 L8,9 L5,9 L5,5 L6,5 L6,8 L6,8 Z M12,8 C12,10.22 10.8,12.16 9,13.19 L9,15 C9,15.55 8.55,16 8,16 L4,16 C3.45,16 3,15.55 3,15 L3,13.19 C1.2,12.16 0,10.22 0,8 C0,5.78 1.2,3.84 3,2.81 L3,1 C3,0.45 3.45,0 4,0 L8,0 C8.55,0 9,0.45 9,1 L9,2.81 C10.8,3.84 12,5.78 12,8 L12,8 Z M11,8 C11,5.23 8.77,3 6,3 C3.23,3 1,5.23 1,8 C1,10.77 3.23,13 6,13 C8.77,13 11,10.77 11,8 L11,8 Z' id='Shape' />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div style={{display: 'flex', position: 'absolute', background: 'rgba(255,255,255,1)', bottom: '10px', right: '10px', left: '10px', height: '40px', fontWeight: 'bold', borderRadius: '3px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', zIndex: '30'}}>
          <div onClick={() => { this.timeTravel(-1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', fontWeight: 'bold', borderRight: '1px solid rgba(0,0,0,0.1)'}}>
            <svg width='10px' height='16px' viewBox='0 0 10 16' version='1.1'>
              <g id='Octicons' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='arrow-left' fill='#5e2fed'>
                  <polygon id='Shape' points='6 3 0 8 6 13 6 10 10 10 10 6 6 6' />
                </g>
              </g>
            </svg>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', textTransform: 'uppercase', height: '40px', width: 'calc(100% - 80px)'}}>{'Time Travel'}</div>
          <div onClick={() => { this.timeTravel(1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', fontWeight: 'bold', borderLeft: '1px solid rgba(0,0,0,0.1)'}}>
            <svg width='10px' height='16px' viewBox='0 0 10 16' version='1.1'>
              <g id='Octicons' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='arrow-right' fill='#5e2fed'>
                  <polygon id='Shape' points='10 8 4 3 4 6 0 6 0 10 4 10 4 13' />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(TimeMachine)
