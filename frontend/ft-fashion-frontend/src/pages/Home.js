import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(err => console.error(err));
  }, []);

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
            width: '200px',
            textAlign: 'center'
          }}>
            <img
              src={p.image}
              alt={p.name}
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>${p.price}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
