import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showNoTodosButton, setShowNoTodosButton] = useState(false);

  const host = 'https://todos-app-backend-nine.vercel.app';

  useEffect(() => {
    fetchTodos();
  }, []);

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

  const handleEditClick = (index) => {
    const editedTodo = todos[index];

    setIsEditing(true);
    setEditingIndex(index);
    setNewTodoText(editedTodo.text);
  };

  const handleSaveClick = async () => {
    try {
      if (editingIndex !== null && editingIndex >= 0 && editingIndex < todos.length) {
        const response = await fetch(`${host}/api/updatetodo/${todos[editingIndex]._id}`, {
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
      } else {
        console.error('Invalid index for updating todo.');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this todo?');

    if (confirmDeletion) {
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

  const handleToggleCompletion = async (id, done) => {
    try {
      const response = await fetch(`${host}/api/updatetodo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          done: !done,
        }),
      });

      if (response.ok) {
        fetchTodos();
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md transition-transform duration-300 transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>

        <div className="mb-4">
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

        <ul className="flex flex-col items-center"> {/* Center the list */}
          {todos.map((todo, index) => (
            <li
              key={todo._id}
              className={`flex items-center justify-between p-2 border border-gray-300 mb-2 rounded ${
                todo.done ? 'bg-gray-100' : ''
              }`}
              style={{ width: '300px' }} // Set a fixed width for the todo card
            >
              {isEditing && editingIndex === index ? (
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="p-2 border border-gray-300 rounded mr-2 w-full"
                />
              ) : (
                <span
                  onClick={() => handleToggleCompletion(todo._id, todo.done)}
                  style={{ cursor: 'pointer', textDecoration: todo.done ? 'line-through' : 'none' }}
                >
                  {todo.text}
                </span>
              )}
              <div className="flex">
                <button
                  onClick={() => (isEditing ? handleSaveClick() : handleEditClick(index))}
                  className={`${
                    isEditing ? 'bg-blue-500 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-700'
                  } text-white font-bold py-1 px-2 rounded mr-2 transition-all duration-300`}
                  style={{ backgroundColor: '#3B82F6', marginRight: '5px' }}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteClick(todo._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition-all duration-300"
                  style={{ backgroundColor: '#EF4444' }}
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

export default TodoApp;
