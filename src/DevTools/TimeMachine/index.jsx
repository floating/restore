/*
  Time Machine Component
*/

import React from 'react'
import connect from '../../connect'

import icons from '../icons'

const color = {
  a: '#dbe4f5',
  b: 'rgb(237, 244, 255)',
  c: '#f5f9ff',
  d: 'white',
  z: 'rgb(230, 238, 253)',
  text: 'rgb(61, 90, 144)',
  good: '#49e6b4',
  bad: 'red'
}

class TimeMachine extends React.Component {
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
  actionsToName (actions) {
    console.log(actions)
    // return actions.map(action => action.name + (action.count ? ` (${this.ordinal(action.count + 1)} Update)` : '') + (action.deferred ? ' [deferred]' : '')).join(' > ')
  }
  logState (state) {
    return e => {
      e.stopPropagation()
      console.log(state)
    }
  }
  renderUpdates (updates) {
    let style = {
      update: {},
      updatePath: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whitespace: 'nowrap',
        overflow: 'hidden',
        fontFamily: 'monospace',
        padding: '5px',
        background: color.b,
        // borderBottom: `1px solid ${color.z}`,
        fontSize: '13px'
      }
    }
    let stringLength = 14
    const displayPath = (path) => {
      if (path.length > stringLength) path = '...' + path.substring(path.length - stringLength, path.length)
      return path
    }
    const displayValue = (value) => {
      if (value !== undefined && value !== null) {
        if (value.constructor === Object) {
          value = 'Object(' + Object.keys(value).length + ')'
        } else if (value.constructor === Array) {
          value = 'Array(' + value.length + ')'
        } else {
          value = JSON.stringify(value)
          if (value.length > stringLength) value = value.substring(0, stringLength) + '...'
        }
      }
      return value
    }
    const logUpdate = (path, value) => {
      console.log(' ')
      console.log('Updated Path: ' + path)
      console.log(value)
      console.log(' ')
    }
    return (
      <div>
        {updates.map((update, i) => {
          return (
            <div key={i} style={style.update}>
              <div style={style.updatePath} onClick={(e) => logUpdate(update.path, update.value)}>
                <span>{displayPath(update.path)}</span>
                <span>&nbsp;=&nbsp;</span>
                <span style={{fontWeight: 'bold'}}>{displayValue(update.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  renderActions (actions) {
    let style = {
      action: {
        // borderRadius: '3px',
        overflow: 'hidden',
        background: color.d,
        color: color.text
        // boxShadow: '0px 0px 1px rgba(75,0,150,0.4)'
        // marginBottom: '10px'
      },
      actionName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        brderBottom: `1px solid ${color.z}`,
        justifyContent: 'space-between',
        padding: '5px'
        // background: 'rgba(255,255,255,1)'
      }
    }
    return (
      <div>
        {actions.map((action, i) => {
          return (
            <div key={i} style={style.action}>
              <div style={style.actionName}>
                <div>{action.name}</div>
                {action.deferred ? <div>{icons.cycle({color: color.text})}</div> : null}
              </div>
              {this.renderUpdates(action.updates)}
            </div>
          )
        })}
      </div>
    )
  }
  renderDetails (batch) {
    let style = {
      details: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 'px',
        fontSize: '10px',
        fontWeight: 'bold',
        // height: '40px',
        background: color.c,
        color: color.text,
        // fontWeight: 'bold',
        textTransform: 'uppercase'
      },
      detail: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '5px 0px 7px 0px'
      },
      display: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '3px'
      },
      icon: {
        padding: '6px'
      },
      count: {
        fontSize: '23px'
      },
      text: {
        padding: '0px 0px 4px 4px'
      }
    }
    let actionCount = batch.actions.length
    let updateCount = 0
    batch.actions.forEach(action => { updateCount += action.updates.length })
    let observerCount = batch.obs
    return (
      <div style={style.details}>
        <div style={style.detail}>
          <div style={style.display}>
            <div style={style.icon}>{icons.radio({color: color.text})}</div>
            <div style={style.count}>{actionCount}</div>
          </div>
          <div style={style.text}>{actionCount === 1 ? 'action' : 'actions'}</div>
        </div>
        <div style={style.detail}>
          <div style={style.display}>
            <div style={style.icon}>{icons.merge({color: color.text})}</div>
            <div style={style.count}>{updateCount}</div>
          </div>
          <div style={style.text}>{updateCount === 1 ? 'update' : 'updates'}</div>
        </div>
        <div style={style.detail}>
          <div style={style.display}>
            <div style={style.icon}>{icons.telescope({color: color.text})}</div>
            <div style={style.count}>{observerCount}</div>
          </div>
          <div style={style.text}>{observerCount === 1 ? 'observer' : 'observers'}</div>
        </div>
      </div>
    )
  }
  renderPoint (batch, index, back) {
    let style = {
      bot: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: '20',
        whiteSpace: 'nowrap',
        background: color.z,
        height: '40px',
        color: color.text,
        margin: '10px 0px',
        borderRadius: '25px'
      },
      button: {
        // background: 'rgba(255,255,255,0.8)',
        // boxShadow: '0px 0px 1px rgba(75,0,150,0.4)',
        padding: '0px 20px',
        height: '100%',
        //width: '100px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid rgba(0,0,0,0.1)',
        margin: '10px 0px',
        borderRadius: '20px'
        // ,
        // background: color.z
      },
      here: {
        // background: '#5e2fed',
        // boxShadow: '0px 0px 1px rgba(75,0,150,0.4)',
        // padding: '7px',
        // borderRadius: '3px',
        // fontSize: '12px',
        // fontWeight: 'bold',
        // borderRight: `1px solid ${color.a}`,
        background: color.good

        // background: 'linear-gradient(45deg, rgba(168, 113, 255, 0.2) 0%, rgba(168, 113, 255, 0) 100%)'
      }
    }
    const onClick = () => {
      if (back) {
        this.timeTravel(index - this.history.length + 1)
      } else {
        this.timeTravel(index + 1)
      }
    }
    return (
      <div style={style.bot}>
        {index === this.history.length - 1 && back ? (
          <div style={{...style.button, ...style.here}}>{'Current'}</div>
        ) : (
          <div style={{...style.button}} onClick={onClick}>{'Travel Here'}</div>
        )}
        <div style={{...style.button}} onClick={this.logState(batch.state)}>{'Log State'}</div>
      </div>
    )
  }
  renderTimeline () {
    let style = {
      timeline: {
        cursor: 'pointer',
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
      },
      current: {
        position: 'absolute',
        width: '30px',
        height: '30px',
        background: 'gold',
        left: '-5px',
        top: 'calc(50% - 15px)',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }

    let item = (batch, i, back) => {
      return (
        <div key={i} style={style.item}>
          {i === 0 && back ? null : this.renderActions(batch.actions)}
          {i === 0 && back ? null : this.renderDetails(batch)}
          {this.renderPoint(batch, i, back)}
        </div>
      )
    }

    return (
      <div ref={(scroll) => { if (scroll) this.scroll = scroll }} style={style.timeline}>
        <div style={{
          // height: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          // fontWeight: 'bold',
          // background: 'linear-gradient(0deg, #3b26a8 0%, #452a9d 100%)',
          // background: '#4c2b92',
          // background: `linear-gradient(10deg, rgb(68, 63, 93) 0%, #4f6c98 100%)`,

          marginTop: '10px',
          //borderTopLeftRadius: '5px',
          //borderTopRightRadius: '5px',
          height: '150px'
          //borderBottom: `1px solid ${color.a}`,
          //boxShadow: '0px 0px 4px rgba(200,0,200,0.7)'
          // background: color.z
          }}>

          header

        </div>
        {this.history.map((batch, i) => item(batch, i, true))}
        {this.future.map((batch, i) => item(batch, i, false))}
        <div style={{width: '100%', height: '50px'}} />
      </div>
    )
  }
  render () {
    let style = {
      timeMachine: {
        cursor: 'pointer',
        position: 'fixed',
        width: '342px',
        top: '0px',
        right: this.state.expand ? '0px' : '-353px',
        bottom: '0px',
        background: color.a,
        fontSize: '14px',
        fontFamily: 'sans-serif',
        transition: '0.4s all cubic-bezier(0.85, 0, 0.15, 1)',
        color: color.text,
        // boxShadow: 'inset 0px 1px 3px rgba(0,0,150,0.3)',
        zIndex: '99999999'
      },
      clock: {
        height: '36px',
        width: '36px',
        borderTopLeftRadius: '50%',
        // background: 'linear-gradient(45deg, rgb(168, 113, 255) 0%, #5e2fed 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
    return (
      <div style={style.timeMachine}>
        {this.renderTimeline()}
        <div style={{
          width: '8px',
          background: 'white',
          position: 'absolute',
          top: '0px',
          bottom: '0px',
          left: '-8px'
          // borderLeft: '1px solid  rgba(0,0,0,0.2)',
          // zIndex: '1'
          // right: '-10px',
          // top: '0px',
          // bottom: '0px'
        }} />
        <div onClick={() => { this.setState({expand: !this.state.expand}) }} style={{
          position: 'absolute',
          height: '40px',
          width: '40px',
          borderTopLeftRadius: '20px',
          borderBottomLeftRadius: '20px',
          background: 'white',
          // borderTop: '1px solid rgba(0,0,0,0.2)',
          // borderLeft: '1px solid  rgba(0,0,0,0.2)',
          // borderBottom: '1px solid  rgba(0,0,0,0.2)',
          bottom: '50%',
          left: '-48px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '2'
        }}>
          <div style={{paddingLeft: '3px'}}>
            {icons.clock({color: color.text})}
          </div>
        </div>
        <div style={{display: 'flex', position: 'absolute', background: 'rgba(255,255,255,1)', bottom: '10px', right: '10px', left: '10px', height: '40px', fontWeight: 'bold', borderRadius: '3px', boxShadow: '0px 1px 3px rgba(0,0,150,0.3)', zIndex: '30'}}>
          <div onClick={() => { this.timeTravel(-1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', fontWeight: 'bold', borderRight: '1px solid rgba(0,0,0,0.1)'}}>
            {icons.arrow({color: color.text, direction: 'left'})}
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', textTransform: 'uppercase', height: '40px', width: 'calc(100% - 80px)'}}>{'Time Travel'}</div>
          <div onClick={() => { this.timeTravel(1) }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', width: '40px', fontWeight: 'bold', borderLeft: '1px solid rgba(0,0,0,0.1)'}}>
            {icons.arrow({color: color.text, direction: 'right'})}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(TimeMachine)
