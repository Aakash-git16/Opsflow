import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../services/api';

const EmployeeDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getAllRequests();
      const requestData = response.data;
      setRequests(requestData);
      
      // Calculate stats
      const newStats = {
        total: requestData.length,
        pending: requestData.filter(r => r.status === 'PENDING').length,
        approved: requestData.filter(r => r.status === 'APPROVED').length,
        rejected: requestData.filter(r => r.status === 'REJECTED').length,
        completed: requestData.filter(r => r.status === 'COMPLETED').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await requestAPI.completeRequest(requestId, 'Marked as completed by employee');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee Dashboard</h2>
        <Link to="/create-request" className="btn btn-primary">
          Create New Request
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          My Requests
        </div>
        <div className="card-body">
          {requests.length === 0 ? (
            <p>No requests found. <Link to="/create-request">Create your first request</Link></p>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <h4>{request.title}</h4>
                  <p>{request.description}</p>
                  <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  {request.status === 'APPROVED' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleCompleteRequest(request.id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;