import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const host = 'http://localhost:3000';

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${host}/api/getalltodos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.error('Failed to fetch todos:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  const handleDeleteClick = async (index) => {
    try {
      const response = await fetch(`${host}/api/deletetodo/${index}`, {
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

  const handleEditClick = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const handleSaveClick = async (index) => {
    try {
      const response = await fetch(`${host}/api/updatetodo/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        fetchTodos();
        setEditIndex(null);
        setEditText('');
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Todo List</h2>
      <div className="flex flex-wrap justify-center">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`max-w-md w-full bg-white p-4 m-4 rounded shadow-md transition duration-300 ease-in-out ${
              editIndex === todo._id ? 'transform scale-105' : ''
            }`}
          >
            {editIndex === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveClick(todo._id)}
                    className="bg-green-500 text-white py-1 px-2 rounded mr-2 transition duration-300 ease-in-out hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="bg-gray-500 text-white py-1 px-2 rounded transition duration-300 ease-in-out hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">{todo.text}</p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleEditClick(todo._id, todo.text)}
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2 transition duration-300 ease-in-out hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(todo._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded transition duration-300 ease-in-out hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
