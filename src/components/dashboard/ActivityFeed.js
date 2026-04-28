import React from 'react';

const activities = [
  { text: 'Dr. Chen updated prescription for Sarah Johnson', time: '10 min ago', color: '#3b82f6' },
  { text: 'Lab results uploaded for Robert Brown', time: '25 min ago', color: '#10b981' },
  { text: 'Maria Garcia moved to Critical status', time: '1 hour ago', color: '#ef4444' },
  { text: 'New patient registration: Amanda Foster', time: '2 hours ago', color: '#8b5cf6' },
  { text: 'Dr. Rodriguez completed surgery notes', time: '3 hours ago', color: '#f59e0b' },
  { text: 'Insurance claim approved for James Williams', time: '4 hours ago', color: '#06b6d4' },
];

export default function ActivityFeed() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Activity</h3>
      </div>
      <div className="card-body">
        <ul className="activity-list">
          {activities.map((activity, i) => (
            <li key={i} className="activity-item">
              <div className="activity-dot" style={{ background: activity.color }} />
              <div>
                <div className="activity-text">{activity.text}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
