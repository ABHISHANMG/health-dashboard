import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Profile Information</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" defaultValue="Dr. Admin" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" defaultValue="admin@medflow.com" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input className="form-input" defaultValue="Administrator" disabled />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select className="form-input">
                <option>General Administration</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Notifications</h3></div>
          <div className="card-body">
            {['Email Notifications', 'SMS Alerts', 'Critical Patient Alerts', 'Appointment Reminders', 'System Updates'].map((item) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                  <span style={{
                    position: 'absolute', inset: 0, background: '#3b82f6', borderRadius: 12,
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute', left: 22, top: 2, width: 20, height: 20,
                      background: 'white', borderRadius: '50%', transition: '0.3s',
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Security</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label>Current Password</label>
              <input className="form-input" type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input className="form-input" type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input className="form-input" type="password" placeholder="Confirm new password" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Application</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label>Language</label>
              <select className="form-input">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select className="form-input">
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Pacific Time (PT)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select className="form-input">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
