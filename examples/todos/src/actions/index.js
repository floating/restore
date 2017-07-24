let nextTodoId = 0

export const addTodo = (update, text) => {
  update('todos', todos => {
    let todo = {id: nextTodoId++, text, completed: false}
    todos.push(todo)
    return todos
  })
  update('todos', todos => {
    let todo = {id: nextTodoId++, text, completed: false}
    todos.push(todo)
    return todos
  })
  setTimeout(() => {
    update('todos', todos => {
      let todo = {id: nextTodoId++, text, completed: false}
      todos.push(todo)
      return todos
    })
  }, 1000)
}

export const toggleTodo = (update, id) => {
  update('todos', todos => {
    todos.map((todo) => {
      if (todo.id === id) todo.completed = !todo.completed
      return todo
    })
    return todos
  })
}

export const setVisibility = (update, newVisibility) => {
  update('visibility', visibility => newVisibility)
}
