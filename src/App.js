import './App.css';
import TodoApp from './components/todos'; 
// import TodoList from './components/todoList'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoApp />} />
      </Routes>
    </Router>
  );
}

export default App;
