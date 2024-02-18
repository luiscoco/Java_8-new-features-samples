import React, { useState } from 'react';
import TodoItem from './TodoItem';

class TodoList extends React.Component {
  state = {
    todos: [],
    newTodoText: ''
  };

  addTodo = () => {
    if (this.state.newTodoText.trim()) { // Prevent empty todos
      this.setState({
        todos: [
          ...this.state.todos, 
          { id: Date.now(), text: this.state.newTodoText, completed: false }
        ],
        newTodoText: ''
      });
    }
  };

  toggleComplete = (id) => {
    this.setState({
      todos: this.state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  deleteTodo = (id) => {
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== id)
    });
  };

  render() {
    return (
      <div>
        <input 
          type="text" 
          value={this.state.newTodoText}
          onChange={(e) => this.setState({ newTodoText: e.target.value })}
        />
        <button onClick={this.addTodo}>Add</button>
        <ul>
          {this.state.todos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggleComplete={this.toggleComplete}
              onDelete={this.deleteTodo}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoList;
