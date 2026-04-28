import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { departmentData } from '../../data/mockData';

export default function DepartmentChart() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Patients by Department</h3>
      </div>
      <div className="card-body chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="patients"
            >
              {departmentData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} patients`, name]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {departmentData.map((dept) => (
            <div key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: dept.color }} />
              <span style={{ color: '#6b7280' }}>{dept.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
