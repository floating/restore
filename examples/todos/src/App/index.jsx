import React from 'react'
import Restore from 'react-restore'
import DevTools from 'restore-devtools'

import Add from './Add'
import List from './List'
import Filter from './Filter'

const App = () => (
  <div>
    <Add />
    <List />
    <Filter />
    <DevTools />
  </div>
)

export default Restore.connect(App)
