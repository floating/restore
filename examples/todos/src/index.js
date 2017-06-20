import React from 'react'
import ReactDOM from 'react-dom'
import Restore from '../../../'

import App from './App'
import * as actions from './actions'

let initialState = {
  visibility: 'All',
  todos: []
}

const store = Restore.create(initialState, actions)
const Root = Restore.connect(App, store)

ReactDOM.render(<Root />, document.getElementById('root'))
