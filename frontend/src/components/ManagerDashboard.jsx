import React, { useState, useEffect } from 'react';
import { requestAPI } from '../services/api';

const ManagerDashboard = () => {
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

  const handleApproveRequest = async (requestId) => {
    try {
      await requestAPI.approveRequest(requestId, 'Approved by manager');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const comment = prompt('Please provide a reason for rejection:');
    if (comment !== null) {
      try {
        await requestAPI.rejectRequest(requestId, comment || 'Rejected by manager');
        fetchRequests(); // Refresh the list
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Manager Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
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
          All Requests
        </div>
        <div className="card-body">
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <h4>{request.title}</h4>
                  <p>{request.description}</p>
                  <p>Employee: {request.employee.fullName}</p>
                  <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                  {request.manager && (
                    <p>Manager: {request.manager.fullName}</p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  {request.status === 'PENDING' && (
                    <div className="request-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
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

export default ManagerDashboard;