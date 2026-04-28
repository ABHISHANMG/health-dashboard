import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { departmentData, appointmentsByDay, revenueData } from '../data/mockData';

const patientAgeData = [
  { range: '0-18', count: 1840 },
  { range: '19-30', count: 2650 },
  { range: '31-45', count: 3420 },
  { range: '46-60', count: 2890 },
  { range: '61-75', count: 1540 },
  { range: '75+', count: 507 },
];

const insuranceData = [
  { name: 'BlueCross', value: 3200, color: '#3b82f6' },
  { name: 'UnitedHealth', value: 2800, color: '#10b981' },
  { name: 'Aetna', value: 2400, color: '#f59e0b' },
  { name: 'Cigna', value: 2100, color: '#ef4444' },
  { name: 'Medicare', value: 1500, color: '#8b5cf6' },
  { name: 'Other', value: 847, color: '#6b7280' },
];

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Comprehensive insights across your healthcare operations</p>
        </div>
        <button className="btn btn-outline">Export Report</button>
      </div>

      {/* Revenue Trend */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3>Monthly Revenue Trend</h3></div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip formatter={(v) => [`$${(v / 1000).toFixed(1)}K`]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Insurance Distribution</h3></div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={insuranceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {insuranceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} patients`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department & Appointments */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3>Department Revenue</h3></div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip formatter={(v) => [`$${(v / 1000).toFixed(1)}K`]} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {departmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Appointments by Day</h3></div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={appointmentsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="card">
        <div className="card-header"><h3>Patient Age Distribution</h3></div>
        <div className="card-body chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={patientAgeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" name="Patients" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
