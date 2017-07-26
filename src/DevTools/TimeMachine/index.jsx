/*
  Time Machine Component
*/

import React from 'react'
import connect from '../../connect'

import icons from '../icons'

import Actions from './Actions'
import Details from './Details'

const color = {
  back: 'rgb(44, 48, 53)',
  a: '#dbe4f5',
  // a: '#392565',
  b: 'rgb(237, 244, 255)',
  // b: '#6246a1',
  d: 'rgb(74, 87, 109)',
  c: 'white',
  z: 'rgb(230, 238, 253)',
  text: 'white',
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
  logState (state) {
    return e => {
      e.stopPropagation()
      console.log(state)
    }
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
        borderRadius: '5px',
        overflow: 'hidden',
        background: 'rgb(57, 65, 78)',
        marginBottom: '10px',
        padding: '0px 5px 0px 5px',
        position: 'relative'
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
      },
      marker: {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        width: '30px',
        background: '#3d4552'
      },
      current: {
        background: color.good
      },
      body: {
        marginLeft: '30px'
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
      log : {
        textTransform: 'uppercase',
        fontSize: '10px',
        paddingRight: '5px',
        paddingTop: '0px'
      }
    }

    let item = (batch, i, future) => {
      // {i === 0 && !future ? null : <Actions actions={batch.actions} color={color} />}
      // {i === 0 && !future ? null : <Details batch={batch} color={color} index={i} future={future} history={this.history} />}
      let marker = i === this.history.length - 1 && !future ? {...style.marker, ...style.current} : style.marker

      return (
        <div key={i} style={style.item}>
          <div style={marker}></div>
          <div style={style.body}>
            <div style={style.top}>
              <Details batch={batch} color={color} index={i} future={future} history={this.history} />
            </div>
            <div style={style.mid}>
              <Actions actions={batch.actions} color={color} />
            </div>
            <div style={style.bot}>
              <div style={style.log} onClick={() => console.log(batch.state)}>Log State</div>
            </div>
          </div>
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
          //borderBottom: `1px solid ${color.back}`,
          //boxShadow: '0px 0px 4px rgba(200,0,200,0.7)'
          // background: color.z
          }}>

          header

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
        cursor: 'pointer',
        position: 'fixed',
        width: '342px',
        top: '0px',
        right: this.state.expand ? '0px' : '-353px',
        bottom: '0px',
        background: color.back,
        fontSize: '14px',
        fontFamily: 'sans-serif',
        transition: '0.4s all cubic-bezier(0.85, 0, 0.15, 1)',
        color: color.text,
        // boxShadow: 'inset 0px 1px 3px rgba(0,0,150,0.3)',
        zIndex: '99999999'
        //background: 'linear-gradient(10deg, rgb(68, 63, 93) 0%, #4f6c98 100%)'
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
          width: '5px',
          background: 'white',
          position: 'absolute',
          top: '0px',
          bottom: '0px',
          left: '-5px'
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
          left: '-45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '2'
        }}>
          <div style={{paddingLeft: '3px'}}>{icons.beaker({color: color.text})}</div>
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
