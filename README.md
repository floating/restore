# Restore

*A __simple__ state container for React apps*

- __Predictable__ - Unidirectional data flow makes it easy to test, debug and reason about your application.
- __Observable__ - Observable state keeps your components in sync automatically, eliminating unnecessary renders.
- __Immutable__ - Frozen state and thaw/replace updates provide baked in immutability.
- __DevTools__ - Helpful DevTools, including time travel, provide clear visibility of your state, actions, updates and observers.

![Restore DevTools](http://i.imgur.com/eZZTPqU.gif)

## Install

```
npm install react-restore
```

## Creating a `store`

```javascript
// A store holds the state of the application and the actions used to update that state.

import Restore from 'react-restore'
import * as actions from './actions'
let initialState = {text: 'Hello World'}
let store = Restore.create(initialState, actions)

// Now we have a store!
```

## Accessing values in the `store`

```javascript
// To get the `text` value from the store we would do...

store('text') // 'Hello World'

```

## Updating values in the `store`

- `actions` are used to dispatch updates to the `store`
- `actions` are passed in as an object during `store` creation
- The `actions` object can be created explicitly or by using import syntax. e.g. `import * as actions from './actions'`

```javascript
// We'll create an action called setText to update the text value in our store.

export const setText = (update, newText) => {
  update(state => {
    state.text = newText
    return state
  })
}
```

```javascript
// setText can now be called via the store...

store.setText('Updated World') 

// This would update the value text in the store to 'Updated World'
```

`actions` are passed the `update` method as their first argument, followed by arguments you passed to them.

## The `update` method

- The `update` method is how we replace values held by the `store`
- The `update` method uses a pure updater function

```javascript
// If you look back at our setText action example you can see our updater function is...

state => {
  state.text = newText
  return state
}

// The updater function is passed the state (or part of the state) and returns an updated version of it
```

## Targeting state updates with `update`

- `update` takes a dot notation path as an optional first argument
- This allows you to target part of the `state` instead of the whole `state`
- By doing this, only the components that care about what you're targeting will re-render and the rest will not

```javascript
// For example, our setText action could be written as...

export const setText = (update, newText) => {
 update('text', text => {
   return newText
 })
}
```

Targeting updates with a more complex `state`...

```javascript
import Restore from 'react-restore'
import * as actions from './actions'
let initialState = {nested: {wordOne: 'Hello', wordTwo: 'World'}}
let store = Restore.create(initialState, actions)
```

```javascript
// An action to update the nested value wordTwo...

export const setNestedText = (update, newWordTwo) => {
  update('nested.wordTwo', wordTwo => newWordTwo)
}
```

```javascript
// And calling it is the same as before...

store.setNestedText('Updated!')

// This would update the value of wordTwo from 'World' to 'Updated!'
```

## Connecting the `store` to your `React` components
```javascript
// Connecting React components to the store is as easy as...

Restore.connect(Component)
```
- Once a component is connected, it will have access to the `store` via `this.store`
- It will automatically re-render itself when a value it consumes from the `store` changes
- A connected component inherits the `store` of its closest connected parent
- At the top level of your app you will explicitly connect a `store` to the component since it has no parent to inherit from
- That `store` that will be passed down to your other connected components
- We recommend using a single top-level `store` for your app

```javascript
Restore.connect(Component, store) // Explicitly connects store to Component
Restore.connect(Component) // Component inherits store from parent Component
```

```javascript
// To access the store from within a connected component, we do the same as before but this time referencing this.store

this.store('text')

// or 

this.store.setText('Updated World')
```

## Enabling DevTools / Time Travel

- Restore ships with a dev tools component `<Restore.DevTools />`
- Drop it anywhere in your application to enable the dev tools

## Standalone Observers

```javascript
// Connected components are observers but you can leverage this functionality outside of components too

store.observer(() => {
  console.log(store('text'))
})

// This function will run once immediately and again anytime the values it consumes change, in this case our `text` value

```

## Putting it together

`App.jsx`
```jsx

import React from 'react'
import Restore from 'react-restore'

class App extends React.Component {
  render () {
    return (
      <div onClick={() => this.store.setText('Updated World')}>
        {this.store('text')}
      </div>
    )
  }
}

export default Restore.connect(App)

```

`actions.js`
```javascript

export const setText = (update, newText) => {
  update('text', text => {
    return newText
  })
}

```

`index.js`
```javascript

import React from 'react'
import ReactDOM from 'react-dom'
import Restore from 'react-restore'

import App from './App.jsx'
import * as actions from './actions.js'

let initialState = {text: 'Hello World'}
let store = Restore.create(initialState, actions)
let Root = Restore.connect(App, store)

ReactDOM.render(<Root />, document.getElementById('root'))

```
