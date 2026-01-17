import React from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🧩 1️⃣ PLACE THIS FUNCTION *INSIDE* the component but BEFORE the return()
  const handleCheckout = async () => {
    const orderData = {
      customer_email: prompt("Enter your email to receive invoice:"),
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const data = await res.json();

        // Convert the hex string to a byte array
        const pdfBytes = new Uint8Array(
          data.pdf.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
        );

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${data.order_code}.pdf`;
        link.click();

        alert('✅ Order placed successfully! Invoice downloaded.');
        clearCart();
      } else {
        alert('❌ Checkout failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during checkout');
    }
  };

  // 🧩 2️⃣ Everything below is your cart table + the Checkout button
  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th><th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price} BDT</td>
                  <td>{(item.price * item.quantity).toFixed()} BDT</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: '15px' }}>Total: {total.toFixed(2)} BDT</h3>

          {/* 🧩 3️⃣ ADD CHECKOUT BUTTON HERE — below total */}
          <button
            onClick={handleCheckout}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Checkout & Download Invoice
          </button>

          <button
            onClick={clearCart}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
