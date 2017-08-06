# Restore

*A __simple__ state container for React apps*

- __Simple__ - Reduced boilerplate, minimal interface, refined patterns
- __Observable__ - Observable state keeps your components in sync automatically, eliminating unnecessary renders
- __Predictable__ - Unidirectional data makes it easy to test, debug and reason about your application
- __Immutable__ - Frozen state along with thaw/replace updates provide baked in immutability
- __DevTools__ - Helpful tools, including time travel, provide clear visibility of your state, actions, updates & observers

![Restore DevTools](http://i.imgur.com/cQ7IjCr.gif)

## Install

```
npm install react-restore
```

## Creating a store

A `store` holds the `state` of the application and the `actions` used to `update` that `state`

```javascript
import Restore from 'react-restore'
import * as actions from './actions'
let initialState = {text: 'Hello World'}
let store = Restore.create(initialState, actions)
```

__Now we have a store!__

## Accessing values in the store

To get the `text` value from the `store`
```javascript
store('text') // 'Hello World'
```

## Updating values in the store

- `actions` are used to dispatch updates to the `store`
- `actions` are passed as an object during `store` creation
- The `actions` object can be created explicitly or by using import syntax. e.g. `import * as actions from './actions'`

Let's create an action called `setText` to `update` the `text` value in our `store`

```javascript
export const setText = (update, newText) => {
  update(state => {
    state.text = newText
    return state
  })
}
```

`setText` can now be called via the `store`

```javascript
store.setText('Updated World') 
```

This would update the value `text` in the `store` to `'Updated World'`

## The update method

- `actions` are passed the `update` method as their first argument (followed by arguments you passed)
- The `update` method is how we replace values held by the `store`
- The `update` method uses a pure updater function

If you look back at our `setText` `action` you can see our `updater` function

```javascript
state => {
  state.text = newText
  return state
}
```

The `updater` function is passed the `state` (or part of the `state`) and returns an updated version of it

## Targeting state updates

- `update` takes a dot notation path as an optional first argument
- This allows you to target part of the `state` instead of the whole `state`
- By doing this, only the components that care about what you're targeting will re-render and the rest will not

For example, our `setText` `action` could be

```javascript
export const setText = (update, newText) => {
 update('text', text => {
   return newText
 })
}
```

__Targeting with a more complex `state`__

```javascript
import Restore from 'react-restore'
import * as actions from './actions'
let initialState = {nested: {wordOne: 'Hello', wordTwo: 'World'}}
let store = Restore.create(initialState, actions)
```

An `action` to `update` the nested value `wordTwo`

```javascript
export const setNestedText = (update, newWordTwo) => {
  update('nested.wordTwo', wordTwo => newWordTwo)
}
```

Calling it is the same as before

```javascript
store.setNestedText('Updated!')
```

This would `update` the value of `wordTwo` from `'World'` to `'Updated!'`

## Connecting the store to your React components

Connecting React components to the `store` is easy

```javascript
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

To access the `store` from within a connected component, we do the same as before but this time referencing `this.store`
```javascript 
this.store('text')
```

```javascript 
this.store.setText('Updated World')
```

## Enabling DevTools / Time Travel

- Restore ships with a dev tools component `<Restore.DevTools />`
- Drop it anywhere in your application to enable the dev tools

## Standalone Observers

Connected components are `observers` but you can use this functionality outside of components too!

```javascript
store.observer(() => {
  console.log(store('text'))
})
```

This function will run once immediately and again anytime the values it consumes change, in this case our `text` value

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
