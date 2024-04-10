import React, { useState, useEffect } from 'react';
import "./todo.scss";

export const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        console.error('Error fetching todos: ', error);
      });
  }, []);

  const addTodo = () => {
    if (!newTodo) return;

    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: newTodo,
        completed: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setTodos([data, ...todos]);
        setNewTodo('');
      })
      .catch(error => {
        console.error('Error adding todo: ', error);
      });
  };

  const updateTodo = (id, updatedTodo) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTodo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const updatedTodos = todos.map(todo => (todo.id === id ? data : todo));
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error updating todo: ', error);
      });
  };

  const deleteTodo = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error deleting todo: ', error);
      });
  };

  return (
    <div className='container'>
      <div className='wrapper'>
        <h1>To-Do List</h1>
        <span className='title'>
          <input 
            type="text" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="Add a Task"
            className='add-task' 
          />
          <button className="add-button" onClick={addTodo}>Add Todo</button>
        </span>
        <ul className='tasklist'>
          {todos.map(todo => (
            <li key={todo.id} className={`task ${todo.completed ? 'completed' : ''}`}>
              <span>
                <span
                  className={`custom-icon circle-icon${todo.completed ? '-check' : ''}`}
                  onClick={() => updateTodo(todo.id, { ...todo, completed: !todo.completed })}
                ></span>
                <span className="text" 
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'grey' : 'black',
                  }}
                >
                  {todo.title}
                </span>
              </span>
              <span className="trash-icon" onClick={() => deleteTodo(todo.id)}>&#x1F5D1;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
