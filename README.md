# Restore

*A predictable & observable state container for React apps*

- __Simple__ - Reduced boilerplate, minimal interface, refined patterns
- __Observable__ - Subscriptions to value changes are automatic, eliminating unnecessary renders
- __Predictable__ - Unidirectional data makes it easy to test, debug and reason about your application
- __Immutable__ - Frozen state along with thaw/replace updates provide baked in immutability
- __DevTools__ - Helpful tools, including time travel, provide clear visibility of your state, actions, updates & observers

![Restore DevTools](http://i.imgur.com/xn7dtIs.gif)

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

* `actions` are used to make updates to the state of the `store`
* `actions` are passed as an object during the `store`'s creation
* The `actions` object can be created explicitly or by using import syntax
  * e.g. `import * as actions from './actions'`
* `actions` contain the whole lifecycle of an update making async updates easy to create and track

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

- `actions` are passed `update` as their first argument (followed by any arguments you passed to them)
- The `update` method is how we replace values held by the `store`
- The `update` method uses a pure updater function to preform these updates

If you look back at our `setText` `action` you can see our `updater` function

```javascript
state => {
  state.text = newText
  return state
}
```

The `updater` function is passed the `state` (or more likely, part of the `state`) and returns an updated version of it

## Targeting state updates

- `update` takes a dot notation path as an optional first argument
- This path allows you to target part of the `state` instead of the whole `state`
- By doing this, only the components that care about what you're targeting will re-render and the rest will not

For example, our `setText` `action` could be

```javascript
export const setText = (update, newText) => {
 update('text', text => {
   return newText
 })
}
```

__Targeting a more complex `state`__

```javascript
import Restore from 'react-restore'
import * as actions from './actions'
let initialState = {
  nested: {
    wordOne: 'Hello',
    wordTwo: 'World'
  }
}
let store = Restore.create(initialState, actions)
```

Let's create an `action` called `setNestedText` to `update` `wordTwo` in our `store`

```javascript
export const setNestedText = (update, newValue) => {
  update('nested.wordTwo', wordTwo => newValue)
}
```

Calling it is the same as before

```javascript
store.setNestedText('Updated World')
```

This would `update` the value of `wordTwo` from `'World'` to `'Updated World'`

__Multi-arg Paths__

Instead of concatenating a string for the path passed to `store` or `update`, you can define your path with multiple arguments. For example if you had an id (`let id = 123`) for an item within the state you could break the path into multiple arguments, like so...

```javascript
let name = store('items', id, 'name') // Gets the value of items[id].name from the store

// When updating, the last argument is always the updater function
update('items', id, 'name', name => 'bar') // Updates the value of items[id].name to 'bar'
```

## Connecting the store to your React components

Connecting React components to the `store` is easy

```javascript
Restore.connect(Component)
```

- Once a component is connected, it will have access to the `store` via `this.store`
- It will automatically re-render itself when a value it consumes from the `store` changes
- A connected component inherits the `store` of its closest connected parent
- At the top-level of your app you will explicitly connect a `store`, since it has no parent to inherit from
- This top-level `store` will be passed down to your other connected components
- We recommend using a single top-level `store` for your app

```javascript
Restore.connect(Component, store) // Explicitly connects store to Component
Restore.connect(Component) // Component inherits store from closest parent Component
```

To access the `store` from within a connected component, we do the same as before but this time referencing `this.store`
```javascript
this.store('text')
// or
this.store.setText('Updated World')
```

## Async Updates

Actions can contain synchronous and asynchronous updates, both are tracked and attributed to the action throughout its lifecycle. Here we'll make our `setText` action get the `newText` value from the server and then update the state asynchronously.

``` javascript
export const setText = update => {
  getTextFromServer(newText => {
    update('text', text => newText)
  })
}
```

It can be useful to compose synchronous and asynchronous updates together. Say you wanted to show a loading message while you fetched the `newText` value from the server. You could update a `loading` flag synchronously and then unset it later when you get the response.

``` javascript
export const setText = update => {
  update('loading', loading => true)
  getTextFromServer(newText => {
    update('loading', loading => false)
    update('text', text => newText)
  })
}
```

## Enabling DevTools / Time Travel

Restore has a `<DevTools />` component you can use to observer and time travel actions and state
```
npm install restore-devtools --save-dev
```
```javascript
import DevTools from 'restore-devtools'
```
Drop `<DevTools />` anywhere in your application to enable the dev tools

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

## Projects using Restore
  - [Frame](https://github.com/floating/frame) - A cross-platform Ethereum interface
