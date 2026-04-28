import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const statusConfig = {
  Confirmed: { badge: 'badge-success', icon: CheckCircle },
  Pending: { badge: 'badge-warning', icon: Clock },
  Cancelled: { badge: 'badge-danger', icon: AlertCircle },
};

export default function RecentAppointments() {
  const { appointments } = useApp();
  const upcoming = appointments.slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Upcoming Appointments</h3>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Today & Tomorrow</span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.Pending;
              return (
                <tr key={apt.id}>
                  <td style={{ fontWeight: 500 }}>{apt.patientName}</td>
                  <td>{apt.doctor}</td>
                  <td>{apt.time}</td>
                  <td>
                    <span className={`badge ${apt.type === 'Urgent' ? 'badge-danger' : 'badge-gray'}`}>
                      {apt.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${config.badge}`}>{apt.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
