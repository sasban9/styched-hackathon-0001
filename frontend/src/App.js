import { Routes,  Route } from 'react-router-dom';
import Tailors from './components/Tailor.js';
import './App.css';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Tailors />} />
      </Routes>
    </div>
  );
}

export default App;
