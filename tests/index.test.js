/* globals test expect */

import React from 'react'
import ReactDOM from 'react-dom'
import Restore from '../lib'

const isRequired = (props, propName, componentName) => {
  if (props[propName] === undefined || props[propName] === null) return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.')
}

test('Catch Navigation Past Non-object Value', () => {
  const store = Restore.create({ test: 'Hello World' }, {})
  expect(store('test')).toBeTruthy()
  expect(() => store('test.deeper')).toThrow()
})

test('Pure Render Components Test', done => {
  const renderCount = { Connected: 0, PureA: 0, PureB: 0, Impure: 0 }
  class PureA extends React.PureComponent {
    render () {
      renderCount.PureA++
      if (this.props.aaa.value === 3) {
        expect(renderCount.Connected).toBe(5)
        expect(renderCount.Impure).toBe(5)
        expect(renderCount.PureA).toBe(4)
        expect(renderCount.PureB).toBe(2)
        done()
      }
      return null
    }
  }
  class PureB extends React.PureComponent {
    render () {
      renderCount.PureB++
      expect(this.props.aab.value).toBeLessThan(2)
      return null
    }
  }
  class Impure extends React.Component {
    render () {
      renderCount.Impure++
      expect(this.props.aab.value).toBeLessThan(2)
      return null
    }
  }
  class Connected extends React.Component {
    render () {
      renderCount.Connected++
      const aa = this.store('a.a')
      return (
        <div>
          <Impure aab={aa.b} />
          <PureA aaa={aa.a} />
          <PureB aab={aa.b} />
        </div>
      )
    }
  }
  const initialState = { a: { a: { a: { value: 0 }, b: { value: 0 } } } }
  const actions = {
    aaaPlus: (update) => update('a.a.a', (a) => { return { value: a.value + 1 } }),
    aabPlus: (update) => update('a.a.b', (b) => { return { value: b.value + 1 } })
  }
  const store = Restore.create(initialState, actions)
  const Root = Restore.connect(Connected, store)
  ReactDOM.render(<Root />, document.createElement('div'))
  store.aabPlus()
  setInterval(store.aaaPlus, 0)
})

test('Target Render Counts', done => {
  const renderCount = { app: 0, deep: 0, deeper: 0 }
  class Deeper extends React.Component {
    render () {
      renderCount.deeper++
      if (this.store('done')) {
        expect(renderCount.app).toBe(1)
        expect(renderCount.deep).toBe(2)
        expect(renderCount.deeper).toBe(3)
        done()
      }
      return <div>{this.store('numThree')}</div>
    }
  }
  const DeeperConnected = Restore.connect(Deeper)
  class Deep extends React.Component {
    render () {
      renderCount.deep++
      return <DeeperConnected num={this.store('numTwo')} />
    }
  }
  const DeepConnected = Restore.connect(Deep)
  class App extends React.Component {
    render () {
      renderCount.app++
      return <DeepConnected num={this.store('numOne')} />
    }
  }
  const actions = {
    updateOne: u => u('numOne', numOne => numOne * 2),
    updateTwo: u => u('numTwo', numTwo => numTwo * 2),
    updateThree: u => u('numThree', numThree => numThree * 2),
    updateDone: u => u('done', done => true)
  }
  const store = Restore.create({ numOne: 2, numTwo: 4, numThree: 8, done: false }, actions)
  const Root = Restore.connect(App, store)
  ReactDOM.render(<Root />, document.createElement('div'))
  setTimeout(() => {
    store.updateTwo().updateThree()
    setTimeout(() => store.updateThree().updateDone(), 0)
  }, 0)
})

test('Nesting stores', () => {
  const storeOne = Restore.create({ number: 1 }, {})
  const storeTwo = Restore.create({ number: 2 }, {})
  class Nest extends React.Component {
    render () {
      expect(this.store('number')).toBe(2)
      return null
    }
  }
  const Nested = Restore.connect(Nest, storeTwo)
  class App extends React.Component {
    render () {
      expect(this.store('number')).toBe(1)
      return <Nested />
    }
  }
  const Root = Restore.connect(App, storeOne)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('Connect Stateless Components', () => {
  let Nest = function () { return <div> {this.store('test')} </div> }
  Nest = Restore.connect(Nest)
  const App = () => <Nest />
  const store = Restore.create({ test: 'Hello World' }, {})
  const Root = Restore.connect(App, store)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('constructor in Connected Component', () => {
  class App extends React.Component {
    constructor (...args) {
      super(...args)
      this.state = { number: 2 }
    }

    render () {
      expect(this.state.number).toBe(2)
      expect(this.store('number')).toBe(4)
      return null
    }
  }
  const Double = Restore.connect(App)
  const store = Restore.create({ number: 4 }, {})
  const Root = Restore.connect(Double, store)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('getChildContext in Connected Component', () => {
  class RecieveContext extends React.Component {
    render () {
      expect(this.store('test')).toBe('Hello World')
      expect(this.context.store).toBeTruthy()
      expect(this.context.restoreParent).toBeTruthy()
      expect(this.context.test).toBe('Hello World')
      return null
    }
  }
  RecieveContext.contextTypes = { test: isRequired }
  const Recieve = Restore.connect(RecieveContext)
  class App extends React.Component {
    getChildContext () {
      return { test: 'Hello World' }
    }

    render () {
      expect(this.store('test')).toBe('Hello World')
      return <Recieve />
    }
  }
  App.childContextTypes = { test: isRequired }
  const Double = Restore.connect(App)
  const store = Restore.create({ test: 'Hello World' }, {})
  const Root = Restore.connect(Double, store)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('componentWillUnmount in Connected Component', done => {
  class App extends React.Component {
    componentWillUnmount () { done() }
    render () { return null }
  }
  const Root = Restore.connect(App, Restore.create({}, {}))
  const container = document.createElement('div')
  ReactDOM.render(<Root />, container)
  ReactDOM.unmountComponentAtNode(container)
})

test('Cast Nested Objects', done => {
  class App extends React.Component {
    componentDidMount () {
      this.store.updateTest()
    }

    render () {
      if (this.store('updated')) {
        expect(this.store('test.deep.deeper')).toBe('Hello World')
        done()
      } else {
        expect(JSON.stringify(this.store())).toBe('{}')
      }
      return null
    }
  }
  const actions = {
    updateTest: (update, text) => {
      update('test.deep.deeper', deeper => 'Hello World')
      update('updated', updated => true)
    }
  }
  const store = Restore.create({}, actions)
  const Root = Restore.connect(App, store)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('Test Render Children With Actions', done => {
  class ChildWithoutStore extends React.Component {
    render () {
      expect(this.store).toBeFalsy()
      return null
    }
  }
  class ChildWithStore extends React.Component {
    componentDidMount () {
      this.store.updateTest('Updated World!')
    }

    render () {
      if (this.store('updated')) {
        expect(this.store('test')).toBe('Updated World!')
        done()
      } else {
        expect(this.store('test')).toBe('Hello World')
      }
      expect(this.store).toBeTruthy()
      return null
    }
  }
  const ChildWithStoreConnected = Restore.connect(ChildWithStore)
  class App extends React.Component {
    render () {
      expect(this.store('test')).toBeTruthy()
      return (
        <div>
          <ChildWithStoreConnected />
          <ChildWithoutStore />
        </div>
      )
    }
  }
  const actions = {
    updateTest: (update, text) => {
      update(state => {
        state.updated = true
        state.test = text
        return state
      })
    }
  }
  const store = Restore.create({ test: 'Hello World', updated: false }, actions)
  const Root = Restore.connect(App, store)
  ReactDOM.render(<Root />, document.createElement('div'))
})

test('Standalone Observer', done => {
  const store = Restore.create({ count: 0, other: 1, remove: 1 }, { add: (update, num) => update('count', count => count + num) })
  store.observer((s, r) => {
    expect(store('count')).toBeLessThanOrEqual(1)
    expect(s('count')).toBeLessThanOrEqual(1)
    expect(r).toBeTruthy()
    r()
    // Get store values after remove without tracking issues
    expect(store('count')).toBeLessThanOrEqual(1)
    expect(s('count')).toBeLessThanOrEqual(1)
  })
  store.observer(function () {
    expect(store('count')).toBeLessThanOrEqual(1)
    expect(this.store('count')).toBeLessThanOrEqual(1)
    expect(this.remove).toBeTruthy()
    // Get store values after remove without tracking issues
    expect(store('count')).toBeLessThanOrEqual(1)
    expect(this.store('count')).toBeLessThanOrEqual(1)
    if (this.store('count') === 0) {
      expect(this.store('remove')).toBe(1) // A link we won't need on the second run
      return this.store.add(1)
    }
    expect(this.store('other')).toBe(1) // A link we only need on the second run
    this.remove()
    done()
  })
})

test('Observer Actions', done => {
  const store = Restore.create({ count: 0 }, { add: (update, num) => update('count', count => count + num) })
  store.observer(() => {
    if (store('count') < 10) return store.add(1)
    done()
  })
})

test('Observer Reregister', done => {
  let c = 0
  const actions = {
    updateTestOne: (update) => update('testOne', testOne => testOne + 1),
    updateTestTwo: (update) => update('testTwo', testTwo => testTwo + 1)
  }
  const store = Restore.create({ testOne: 0, testTwo: 0, testThree: 0 }, actions)
  store.observer(() => {
    c++
    if (store('testOne') === 2) {
      if (store('testTwo') === 2) {
        expect(c).toBe(4)
        done()
      } else {
        expect(store('testTwo')).toBe(1)
      }
    } else {
      expect(store('testThree')).toBe(0)
    }
  })
  store.updateTestOne() // Updates Observer
  setTimeout(() => {
    store.updateTestTwo() // Doesn't Update Observer
    setTimeout(() => {
      store.updateTestOne() // Updates Observer
      setTimeout(() => {
        store.updateTestTwo() // Updates Observer
      }, 0)
    }, 0)
  }, 0)
})

test('Immutability for PureComponents', done => {
  const renderCounts = { PureA: 0, PureABX: 0, PureC: 0, Pure: 0 }
  class PureA extends React.PureComponent {
    render () {
      renderCounts.PureA++
      if (this.props.a.b.y.z === 3) {
        expect(renderCounts.PureABX).toBe(1)
        expect(renderCounts.Pure).toBe(4)
        expect(renderCounts.PureA).toBe(4)
        expect(renderCounts.PureC).toBe(2)
        done()
      }
      return null
    }
  }
  class PureC extends React.PureComponent {
    render () {
      renderCounts.PureC++
      expect(this.props.c[1]).toBe(0)
      return null
    }
  }
  class PureABX extends React.PureComponent {
    render () {
      renderCounts.PureABX++
      expect(renderCounts.PureABX).toBe(1)
      expect(this.props.x).toBe(0)
      return null
    }
  }
  class Pure extends React.PureComponent {
    render () {
      renderCounts.Pure++
      expect(this.props.store.a.b.x).toBe(0)
      return null
    }
  }
  class App extends React.Component {
    render () {
      const a = this.store('a')
      const c = this.store('c')
      const store = this.store()
      return (
        <div>
          <Pure store={store} />
          <PureABX x={a.b.x} />
          <PureC c={c} />
          <PureA a={a} />
        </div>
      )
    }
  }
  const actions = {
    updateZ: (update) => update('a.b.y.z', z => z + 1),
    updateC2: (update) => update('c[2]', v => v + 1)
  }
  const store = Restore.create({ a: { b: { x: 0, y: { z: 0 } } }, c: [0, 0, 0] }, actions)
  const Root = Restore.connect(App, store)
  ReactDOM.render(<Root />, document.createElement('div'))
  store.updateZ()
  setTimeout(() => {
    store.updateZ().updateC2()
    setTimeout(() => {
      store.updateZ()
    }, 0)
  }, 0)
})

test('Array Access', done => {
  let c = 0
  const actions = {
    makeArray: (update, path) => update(path, () => []),
    pushToArray: (update, path, value) => update(path, arr => {
      arr.push(value)
      return arr
    }),
    setValue: (update, path, value) => update(path, v => value)
  }
  const store = Restore.create({}, actions)
  store.observer(() => {
    c++
    const arr = store('a.b.c.d.arr')
    if (arr) expect(arr[2]).toBe(0)
    if (store('a.b.c.d.arr[1]') === 2 && c === 3) done()
  })
  store.makeArray('a.b.c.d.arr').pushToArray('a.b.c.d.arr', 0).pushToArray('a.b.c.d.arr', 0).pushToArray('a.b.c.d.arr', 0)
  setTimeout(() => { store.setValue('a.b.c.d.arr[1]', 2) }, 0)
})

test('Read-only safeguard', done => {
  const actions = { updateV: (update) => update('z', z => { return { y: { x: { v: z.y.x.v + 1 } } } }) }
  const store = Restore.create({ a: { b: 0 }, z: { y: { x: { v: 0 } } } }, actions)
  store.observer(() => {
    const a = store('a')
    expect(() => { a.b = 1 }).toThrow()
  })
  store.observer(() => {
    const z = store('z')
    const y = z.y
    expect(() => { y.x.v = 2 }).toThrow()
    if (y.x.v === 1) {
      expect(() => { y.x.o = 2 }).toThrow()
      expect(() => { y.x.v = 2 }).toThrow()
      expect(y.x.v).toBe(1)
      done()
    }
  })
  store.updateV()
})

test('Multi-arg paths', done => {
  const actions = { updateV: (update) => update('z', 'y.x', 'v', v => v + 1) }
  const store = Restore.create({ a: { b: 0, c: { d: 0 } }, z: { y: { x: { v: 0 } } } }, actions)
  store.observer(() => {
    const $ = 'b'
    expect(store('a', $)).toBe(0)
    expect(store('a.c', 'd')).toBe(0)
    if (store('z', 'y', 'x', 'v') === 1) done()
  })
  store.updateV()
})

test('Observer Deregister', done => {
  let c = 0
  const actions = {
    updateTestOne: (update) => update('testOne', testOne => testOne + 1),
    updateTestTwo: (update) => update('testTwo', testTwo => testTwo + 1),
    updateTestThree: (update) => update('testThree', testThree => testThree + 1)
  }
  const store = Restore.create({ testOne: 0, testTwo: 0, testThree: 0 }, actions)
  class App extends React.Component {
    render () {
      c++
      if (this.props.one === 2) {
        if (store('testTwo') === 2) {
          expect(c).toBe(4)
          done()
          return null
        } else {
          expect(store('testTwo')).toBe(1)
          return null
        }
      } else {
        expect(store('testThree')).toBe(0)
        return null
      }
    }
  }
  const ConnectedApp = Restore.connect(App)
  class Wrap extends React.Component {
    render () {
      return <ConnectedApp one={store('testOne')} />
    }
  }
  const Root = Restore.connect(Wrap, store)
  ReactDOM.render(<Root />, document.createElement('div'))

  store.updateTestOne() // Updates Observer
  setTimeout(() => {
    store.updateTestTwo() // Doesn't Update Observer
    setTimeout(() => {
      store.updateTestOne() // Updates Observer
      setTimeout(() => {
        store.updateTestThree() // Doesn't Update Observer
        setTimeout(() => {
          store.updateTestTwo() // Updates Observer
        }, 0)
      }, 0)
    }, 0)
  }, 0)
})

test('Observing whole state', done => {
  const actions = { updateV: (update) => update('z', z => { return { y: { x: { v: z.y.x.v + 1 } } } }) }
  const store = Restore.create({ a: { b: 0 }, z: { y: { x: { v: 0 } } } }, actions)
  let count = 0
  store.observer(() => {
    store()
    if (count === 3) done()
    count++
    store.updateV()
  })
})
