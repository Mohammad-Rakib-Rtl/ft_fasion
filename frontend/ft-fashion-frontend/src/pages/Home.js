import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';
import { useCart } from '../context/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: parseInt(value) || 1 }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Products</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map(p => (
          <div key={p.id} style={{
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            width: '220px',
            textAlign: 'center'
          }}>
            <img
              src={p.image}
              alt={p.name}
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>{p.price} bdt</strong></p>
            <input
              type="number"
              min="1"
              value={quantities[p.id] || 0}
              onChange={(e) => handleQuantityChange(p.id, e.target.value)}
              style={{ width: '50px', marginRight: '10px' }}
            />
            <button
              onClick={() => addToCart(p, quantities[p.id] || 1)}
              style={{
                backgroundColor: '#ff6600',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
