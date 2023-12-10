// src/Todo.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showNoTodosButton, setShowNoTodosButton] = useState(false);
  const host = 'http://localhost:3000';

  const handleEditClick = async (index) => {
    try {
      const editedTodo = todos[index];

      setIsEditing(true);
      setEditingIndex(index);
      setNewTodoText(editedTodo.text);
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${host}/updatetodo/${todos[editingIndex]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodoText,
          done: todos[editingIndex].done,
        }),
      });

      if (response.ok) {
        console.log('Todo updated successfully');
        fetchTodos();
        setIsEditing(false);
        setEditingIndex(null);
        setNewTodoText('');
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${host}/api/deletetodo/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTodos();
      } else {
        console.error('Failed to delete todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleCreateTodo = async () => {
    try {
      const response = await fetch(`${host}/api/crud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodoText,
          done: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]);
        setNewTodoText('');
        setShowNoTodosButton(false);
      } else {
        console.error('Failed to create todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${host}/api/getalltodos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        setShowNoTodosButton(data.length === 0);
      } else {
        console.error('Failed to fetch todos:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md transition-transform duration-300 transform hover:scale-105">
        <Link to="/todo-list" className="btn btn-primary">
          Add Todo
        </Link>
        <div className="mb-4 mt-4">
          <label htmlFor="todoText" className="block text-sm font-medium text-gray-600">
            Todo Text:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="todoText"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="py-2 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
            />
          </div>
        </div>
        <div className="mb-4">
          <button
            onClick={isEditing ? handleSaveClick : handleCreateTodo}
            className={`${
              isEditing
                ? 'bg-blue-500 hover:bg-blue-700'
                : 'bg-green-500 hover:bg-green-700'
            } text-white font-bold py-2 px-4 rounded w-full transition-all duration-300`}
          >
            {isEditing ? 'Save' : 'Add Todo'}
          </button>
        </div>

        {showNoTodosButton && (
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
            onClick={handleCreateTodo}
          >
            Add Your First Todo
          </button>
        )}

        <ul>
          {todos.map((todo, index) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-2 border border-gray-300 mb-2 rounded"
            >
              {isEditing && editingIndex === index ? (
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="p-2 border border-gray-300 rounded mr-2 w-full"
                />
              ) : (
                <span>{todo.text}</span>
              )}
              <div className="flex">
                <button
                  onClick={() => (isEditing ? handleSaveClick() : handleEditClick(index))}
                  className={`${
                    isEditing ? 'bg-blue-500 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-700'
                  } text-white font-bold py-1 px-2 rounded mr-2 transition-all duration-300`}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteClick(todo._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
