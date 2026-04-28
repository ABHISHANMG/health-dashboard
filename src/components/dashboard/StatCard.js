import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, trend, icon: Icon, iconColor }) {
  const isPositive = trend >= 0;

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-trend ${isPositive ? 'up' : 'down'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(trend)}%
        <span>vs last month</span>
      </div>
    </div>
  );
}
