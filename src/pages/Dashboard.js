import React from 'react';
import { Users, Calendar, DollarSign, ThumbsUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import DepartmentChart from '../components/dashboard/DepartmentChart';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { dashboardStats } from '../data/mockData';

export default function Dashboard() {
  const { totalPatients, activeAppointments, revenue, satisfactionRate, trends } = dashboardStats;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Dr. Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Patients"
          value={totalPatients.toLocaleString()}
          trend={trends.patients}
          icon={Users}
          iconColor="blue"
        />
        <StatCard
          label="Appointments"
          value={activeAppointments}
          trend={trends.appointments}
          icon={Calendar}
          iconColor="green"
        />
        <StatCard
          label="Revenue"
          value={`$${(revenue / 1000).toFixed(1)}K`}
          trend={trends.revenue}
          icon={DollarSign}
          iconColor="yellow"
        />
        <StatCard
          label="Satisfaction"
          value={`${satisfactionRate}%`}
          trend={trends.satisfaction}
          icon={ThumbsUp}
          iconColor="red"
        />
      </div>

      <div className="charts-grid">
        <RevenueChart />
        <DepartmentChart />
      </div>

      <div className="charts-grid">
        <RecentAppointments />
        <ActivityFeed />
      </div>
    </div>
  );
}
