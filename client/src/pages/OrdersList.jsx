import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUS_COLORS = {
  RECEIVED: '#6366f1',
  PROCESSING: '#f59e0b',
  READY: '#22c55e',
  DELIVERED: '#64748b',
};

const NEXT_STATUS = {
  RECEIVED: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'DELIVERED',
};

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      if (search) params.search = search;
      const { data } = await API.get('/orders', { params });
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchOrders();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading orders...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Orders</h2>
        <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name, phone, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          {search && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => { setSearch(''); setLoading(true); setTimeout(fetchOrders, 0); }}
            >
              Clear
            </button>
          )}
        </form>

        <div className="status-filters">
          <button
            className={`filter-btn ${filter === '' ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
          {Object.keys(STATUS_COLORS).map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              style={filter === status ? { backgroundColor: STATUS_COLORS[status], color: '#fff' } : {}}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"></span>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><span className="order-id-badge">{order.orderId}</span></td>
                  <td className="cell-name">{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td className="cell-items">
                    {order.items.map((item, i) => (
                      <span key={i} className="item-tag">
                        {item.type} {item.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="cell-amount">₹{order.totalAmount}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: STATUS_COLORS[order.status] }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="cell-date">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {NEXT_STATUS[order.status] ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateStatus(order._id, NEXT_STATUS[order.status])}
                      >
                        → {NEXT_STATUS[order.status]}
                      </button>
                    ) : (
                      <span className="done-label">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersList;
