import { Routes,  Route } from 'react-router-dom';
import Tailors from './components/Tailor.js';
import Order from './components/Order.js';
import Info from './components/Info';
import './App.css';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Tailors />} />
        <Route path='/:tailorUsername/allOpenOrders' element={<Order />} />
        <Route path='/:tailorUsername/info' element={<Info />} />
      </Routes>
    </div>
  );
}

export default App;
