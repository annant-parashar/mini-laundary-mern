import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrdersList from './pages/OrdersList';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateOrder />} />
            <Route path="/orders" element={<OrdersList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
