import { Routes,  Route } from 'react-router-dom';
import Tailors from './components/Tailor.js';
import Order from './components/Order.js';
import './App.css';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Tailors />} />
        <Route path='/:tailorUsername/allOpenOrders' element={<Order />} />
      </Routes>
    </div>
  );
}

export default App;
