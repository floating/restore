import React from 'react'
import Restore from 'react-restore'

import Add from './Add'
import List from './List'
import Filter from './Filter'

let App = () => (
  <div>
    <Add />
    <List />
    <Filter />
    <Restore.Dev />
  </div>
)

export default Restore.connect(App)
