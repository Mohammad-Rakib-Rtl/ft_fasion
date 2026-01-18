import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import { useCart } from "../context/CartContext";

function Home() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      const reversed = [...data].reverse();

      // ✅ Group products by category name safely
      const grouped = reversed.reduce((acc, product) => {
        const categoryName = product?.category?.name || "Uncategorized";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);
    });
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: parseInt(value) || 1 }));
  };

  const handleSizeChange = (id, value) => {
    setSizes((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const size = sizes[product.id] || "";

    // 🛑 Prevent adding shoes/clothes without selecting size
    if (
      (product?.category?.name?.toLowerCase() === "shoes" ||
        product?.category?.name?.toLowerCase() === "clothes") &&
      !size
    ) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart(product, quantity, size);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🛍️ FT FASHION STORE PRODUCTS
      </h2>

      {Object.keys(groupedProducts).length === 0 ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} style={{ marginBottom: "40px" }}>
            <h2
              style={{
                color: "#e65c00",
                borderBottom: "2px solid #e65c00",
                paddingBottom: "5px",
                marginBottom: "15px",
              }}
            >
              {category}
            </h2>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                paddingBottom: "10px",
              }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "220px",
                    textAlign: "center",
                    flex: "0 0 auto",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
                  <h3 style={{ margin: "10px 0 5px" }}>{p.name}</h3>
                  <p style={{ color: "#555", fontSize: "14px" }}>
                    Code: <strong>{p.code}</strong>
                  </p>
                  <p>
                    <strong>{p.price} BDT</strong>
                  </p>

                  {/* ✅ Size Selector for Shoes and Clothes */}
                  {(p?.category?.name?.toLowerCase() === "shoes" ||
                    p?.category?.name?.toLowerCase() === "clothes") && (
                    <select
                      value={sizes[p.id] || ""}
                      onChange={(e) => handleSizeChange(p.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        marginBottom: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select Size</option>
                      {p.category.name.toLowerCase() === "shoes" ? (
                        <>
                          <option value="36">36</option>
                          <option value="37">37</option>
                          <option value="38">38</option>
                          <option value="39">39</option>
                          <option value="40">40</option>
                        </>
                      ) : (
                        <>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </>
                      )}
                    </select>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="number"
                      min="1"
                      value={quantities[p.id] || 1}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    <button
                      onClick={() => handleAddToCart(p)}
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
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
