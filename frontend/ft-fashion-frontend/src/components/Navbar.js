import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ ADD THIS LINE

function Navbar() {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ff6600",
        padding: "10px 40px",
      }}
    >
      {/* Left side logo/title */}
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h2>🛍️ FT FASHION</h2>
      </Link>

      {/* Center category links */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        <Link to="/shoes" style={{ color: "white", textDecoration: "none" }}>
          Shoes
        </Link>
        <Link to="/clothes" style={{ color: "white", textDecoration: "none" }}>
          Clothes
        </Link>
        <Link to="/bags" style={{ color: "white", textDecoration: "none" }}>
          Bags
        </Link>
      </div>

      {/* Right side cart link */}
      <Link
        to="/cart"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "1.25rem",
        }}
      >
        🛒 Cart{" "}
        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          ({count})
        </span>
      </Link>
    </nav>
  );
}

export default Navbar;
