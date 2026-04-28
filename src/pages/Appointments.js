import React, { useState, useMemo } from 'react';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Appointments() {
  const { appointments, updateAppointmentStatus } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Cancelled', label: 'Cancelled' },
  ];

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchTab = activeTab === 'all' || a.status === activeTab;
      const matchSearch =
        !search ||
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctor.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [appointments, activeTab, search]);

  const statusIcon = (status) => {
    const map = {
      Confirmed: <CheckCircle size={14} style={{ color: '#10b981' }} />,
      Pending: <Clock size={14} style={{ color: '#f59e0b' }} />,
      Cancelled: <XCircle size={14} style={{ color: '#ef4444' }} />,
    };
    return map[status] || null;
  };

  const statusBadge = (status) => {
    const map = { Confirmed: 'badge-success', Pending: 'badge-warning', Cancelled: 'badge-danger' };
    return map[status] || 'badge-gray';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage patient appointments and scheduling</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span style={{ marginLeft: 6, fontSize: 12, opacity: 0.6 }}>
                      ({appointments.filter((a) => a.status === tab.key).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="search-bar" style={{ width: 240 }}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 12 }}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{apt.id}</td>
                  <td style={{ fontWeight: 500 }}>{apt.patientName}</td>
                  <td>{apt.doctor}</td>
                  <td>{apt.department}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.duration} min</td>
                  <td>
                    <span className={`badge ${apt.type === 'Urgent' ? 'badge-danger' : 'badge-gray'}`}>
                      {apt.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadge(apt.status)}`}>
                      {statusIcon(apt.status)} <span style={{ marginLeft: 4 }}>{apt.status}</span>
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {apt.status === 'Pending' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                          style={{ color: '#ef4444', borderColor: '#fecaca' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
