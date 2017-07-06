import React from 'react'
import Restore from 'react-restore'

class List extends React.Component {
  renderTodo = (todo) => {
    let style = {textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer'}
    return <li style={style} key={todo.id} onClick={() => this.store.toggleTodo(todo.id)}>{todo.text}</li>
  }
  filterTodo = (todo) => {
    let visibility = this.store('visibility')
    if (visibility === 'All') return true
    if (visibility === 'Active' && !todo.completed) return true
    if (visibility === 'Completed' && todo.completed) return true
    return false
  }
  render () {
    return <ul>{this.store('todos').filter(this.filterTodo).map(this.renderTodo)}</ul>
  }
}

export default Restore.connect(List)
