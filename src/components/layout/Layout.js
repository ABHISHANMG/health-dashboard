import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { sidebarCollapsed, notificationPermission, notificationSupported } = useApp();
  const hasBanner = notificationSupported && notificationPermission === 'default';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header />
        <div className="page-content" style={hasBanner ? { marginTop: 'calc(var(--header-height) + 44px)' } : undefined}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
