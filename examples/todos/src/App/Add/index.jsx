import React from 'react'
import Restore from 'react-restore'

class Add extends React.Component {
  addTodo (e) {
    e.preventDefault()
    if (!this.input.value.trim()) return
    this.store.addTodo(this.input.value)
    this.input.value = ''
  }
  render () {
    return (
      <div>
        <form onSubmit={e => this.addTodo(e)}>
          <input ref={(i) => { this.input = i }} />
          <button type='submit'>Add Todo</button>
        </form>
      </div>
    )
  }
}

export default Restore.connect(Add)
