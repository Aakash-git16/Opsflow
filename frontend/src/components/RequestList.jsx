import React, { useState, useEffect } from 'react';
import { requestAPI } from '../services/api';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getAllRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'ALL') return true;
    return request.status === filter;
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>All Requests</h2>
        <div>
          <label htmlFor="filter" style={{ marginRight: '0.5rem' }}>Filter by status:</label>
          <select 
            id="filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          Requests ({filteredRequests.length})
        </div>
        <div className="card-body">
          {filteredRequests.length === 0 ? (
            <p>No requests found for the selected filter.</p>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <h4>{request.title}</h4>
                  <p>{request.description}</p>
                  <p>Employee: {request.employee.fullName}</p>
                  <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                  {request.manager && (
                    <p>Manager: {request.manager.fullName}</p>
                  )}
                  {request.updatedAt !== request.createdAt && (
                    <p>Last Updated: {new Date(request.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;