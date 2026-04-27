import { useState } from 'react';
import API from '../api/axios';

const GARMENT_TYPES = ['Shirt', 'Pants', 'Saree', 'Jacket', 'Blanket', 'Curtain', 'Other'];

const DEFAULT_PRICES = {
  Shirt: 30,
  Pants: 40,
  Saree: 80,
  Jacket: 100,
  Blanket: 150,
  Curtain: 120,
  Other: 50,
};

function CreateOrder() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState([{ type: 'Shirt', quantity: 1, price: 30 }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { type: 'Shirt', quantity: 1, price: 30 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'type') {
      updated[index].price = DEFAULT_PRICES[value] || 50;
    }
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const { data } = await API.post('/orders', { customerName, phone, items });
      setSuccess(data);
      setCustomerName('');
      setPhone('');
      setItems([{ type: 'Shirt', quantity: 1, price: 30 }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Create New Order</h2>
        <p className="page-subtitle">Fill in the details to create a laundry order</p>
      </div>

      {success && (
        <div className="alert alert-success">
          <strong>Order Created!</strong>
          <p>Order ID: <span className="order-id-badge">{success.orderId}</span></p>
          <p>Total: ₹{success.totalAmount}</p>
          <p>Estimated Delivery: {new Date(success.estimatedDelivery).toLocaleDateString()}</p>
        </div>
      )}

      {error && <div className="alert alert-error"> {error}</div>}

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-section">
          <h3>Customer Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Garments</h3>
            <button type="button" onClick={addItem} className="btn btn-outline btn-sm">
              + Add Garment
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="garment-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={item.type}
                  onChange={(e) => updateItem(index, 'type', e.target.value)}
                >
                  {GARMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group garment-subtotal">
                <label>Subtotal</label>
                <span className="subtotal-value">₹{item.quantity * item.price}</span>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn btn-danger btn-icon"
                disabled={items.length === 1}
                title="Remove garment"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="form-footer">
          <div className="total-display">
            <span>Total Amount</span>
            <span className="total-value">₹{totalAmount}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;
