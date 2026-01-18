import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import { useCart } from "../context/CartContext";

function CategoryPage({ categoryName }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
  getProducts().then((data) => {
    const filtered = data.filter((p) => {
      const catName = p?.category?.name
        ? p.category.name.toLowerCase()
        : "";
      return catName === categoryName.toLowerCase();
    });
    setProducts(filtered.reverse());
  });
}, [categoryName]);



  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: parseInt(value) || 1 }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#e65c00",
          marginBottom: "30px",
        }}
      >
        {categoryName} Collection
      </h1>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                width: "220px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                padding: "10px",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <h3>{p.name}</h3>
              <p style={{ fontSize: "13px", color: "#999", marginTop: "-5px" }}>
                Code: {p.code}
              </p>
              <p style={{ color: "#555", fontSize: "14px" }}>{p.description}</p>
              <p>
                <strong>${p.price}</strong>
              </p>
              <div style={{ marginTop: "10px" }}>
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(p.id, e.target.value)
                  }
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <button
                  onClick={() => addToCart(p, quantities[p.id] || 1)}
                  style={{
                    backgroundColor: "#ff6600",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
