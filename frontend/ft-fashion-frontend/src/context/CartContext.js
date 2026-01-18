import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1, size = "") => {
  setCart((prev) => {
    const existing = prev.find(
      (item) => item.product.id === product.id && item.size === size
    );
    if (existing) {
      return prev.map((item) =>
        item.product.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      return [...prev, { product, quantity, size }];
    }
  });
};


  const removeFromCart = (productId, size = "") => {
  setCart((prev) =>
    prev.filter(
      (item) =>
        !(item.product?.id === productId && item.size === size)
    )
  );
};


  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
