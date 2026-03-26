import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setSuccess('User role updated successfully');
      fetchUsers(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update user role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setSuccess('User status updated successfully');
      fetchUsers(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update user status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setSuccess('User deleted successfully');
        fetchUsers(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete user');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard - User Management</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="card">
        <div className="card-header">
          All Users ({users.length})
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Created</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Last Login</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <strong>{user.fullName}</strong>
                          <br />
                          <small style={{ color: '#7f8c8d' }}>@{user.username}</small>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          disabled={user.role === 'ADMIN'}
                          style={{
                            padding: '0.25rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: user.role === 'ADMIN' ? '#f5f5f5' : 'white'
                          }}
                        >
                          <option value="EMPLOYEE">Employee</option>
                          <option value="MANAGER">Manager</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span 
                          className={`status-badge ${user.isActive ? 'status-approved' : 'status-rejected'}`}
                          style={{ cursor: user.role !== 'ADMIN' ? 'pointer' : 'default' }}
                          onClick={() => user.role !== 'ADMIN' && toggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.role !== 'ADMIN' && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => deleteUser(user.id, user.username)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Quick Actions:</h4>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Click on role dropdown to change user roles</li>
          <li>Click on status badge to activate/deactivate users</li>
          <li>Use delete button to remove users (except admins)</li>
          <li>Admin users cannot be modified or deleted</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;