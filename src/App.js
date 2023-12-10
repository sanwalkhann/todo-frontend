import './App.css';
import Todo from './components/todos'; 
import TodoList from './components/todoList'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/todo-list" element={<TodoList />} />
      </Routes>
    </Router>
  );
}

export default App;
