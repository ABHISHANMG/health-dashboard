import React from 'react';
import { Star } from 'lucide-react';
import { doctors } from '../data/mockData';

const availabilityBadge = (status) => {
  const map = {
    'Available': 'badge-success',
    'In Surgery': 'badge-warning',
    'On Leave': 'badge-gray',
    'Unavailable': 'badge-danger',
  };
  return map[status] || 'badge-gray';
};

export default function Doctors() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p>{doctors.length} healthcare providers</p>
        </div>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-card-header">
              <div className="doctor-avatar">
                {doctor.name.split(' ').slice(1).map((n) => n[0]).join('')}
              </div>
              <div className="doctor-info">
                <h4>{doctor.name}</h4>
                <p>{doctor.department}</p>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span className={`badge ${availabilityBadge(doctor.availability)}`}>
                {doctor.availability}
              </span>
            </div>
            <div className="doctor-stats">
              <div className="doctor-stat">
                <div className="value">{doctor.patients}</div>
                <div className="label">Patients</div>
              </div>
              <div className="doctor-stat">
                <div className="value" style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {doctor.rating}
                </div>
                <div className="label">Rating</div>
              </div>
              <div className="doctor-stat">
                <div className="value">{doctor.id}</div>
                <div className="label">ID</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
