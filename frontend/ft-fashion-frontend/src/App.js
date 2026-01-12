import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { useCart } from './context/CartContext';

function Navbar() {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 20px',
      backgroundColor: '#ff6600',
      color: 'white'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>🛍️ Ft Fashion</Link>
      <Link to="/cart" style={{ textDecoration: 'none', color: 'white' }}>
        🛒 Cart ({count})
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
