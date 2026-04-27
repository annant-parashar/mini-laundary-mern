import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUS_INFO = {
  RECEIVED: { icon: '', color: '#6366f1', label: 'Received' },
  PROCESSING: { icon: '', color: '#f59e0b', label: 'Processing' },
  READY: { icon: '', color: '#22c55e', label: 'Ready' },
  DELIVERED: { icon: '', color: '#64748b', label: 'Delivered' },
};

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/dashboard');
        setData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page"><div className="loading">Loading dashboard...</div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Overview of your laundry business</p>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card metric-primary">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <span className="metric-value">{data.totalOrders}</span>
            <span className="metric-label">Total Orders</span>
          </div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <span className="metric-value">₹{data.totalRevenue.toLocaleString()}</span>
            <span className="metric-label">Total Revenue</span>
          </div>
        </div>

        <div className="metric-card metric-info">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <span className="metric-value">
              ₹{data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders) : 0}
            </span>
            <span className="metric-label">Avg Order Value</span>
          </div>
        </div>
      </div>

      <h3 className="section-title">Orders by Status</h3>
      <div className="status-grid">
        {Object.entries(data.statusBreakdown).map(([status, count]) => {
          const info = STATUS_INFO[status];
          return (
            <div key={status} className="status-card" style={{ borderLeftColor: info.color }}>
              <div className="status-card-icon">{info.icon}</div>
              <div className="status-card-content">
                <span className="status-card-count">{count}</span>
                <span className="status-card-label">{info.label}</span>
              </div>
              <div
                className="status-card-bar"
                style={{
                  width: `${data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0}%`,
                  backgroundColor: info.color,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
