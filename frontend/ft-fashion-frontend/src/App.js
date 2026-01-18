import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shoes" element={<CategoryPage categoryName="Shoes" />} />
        <Route path="/clothes" element={<CategoryPage categoryName="Clothes" />} />
        <Route path="/bags" element={<CategoryPage categoryName="Bags" />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
