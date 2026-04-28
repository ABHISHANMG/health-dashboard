import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, BellRing, BellOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    toggleMobileMenu,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    notificationPermission,
    notificationSupported,
    requestNotificationPermission,
    sendPushNotification,
  } = useApp();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      sendPushNotification({
        title: 'Notifications Enabled',
        body: 'You will now receive alerts for appointments and critical patients.',
        tag: 'medflow-enabled',
      });
    }
  };

  const handleTestNotification = () => {
    addNotification({
      type: 'alert',
      message: 'Critical: Patient Maria Garcia (P-1003) — vitals outside safe range',
      pushTitle: 'Critical Patient Alert',
      pushBody: 'Maria Garcia (P-1003) — vitals outside safe range. Immediate attention required.',
      url: '/patients',
    });
  };

  return (
    <>
      {/* Notification permission banner */}
      {notificationSupported && notificationPermission === 'default' && (
        <div className="notification-banner">
          <div className="notification-banner-content">
            <BellRing size={16} />
            <span>Enable notifications to get alerts for appointments and critical patients</span>
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleEnableNotifications}>
            Enable
          </button>
        </div>
      )}

      <header className={`header ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={notificationSupported && notificationPermission === 'default' ? { top: 44 } : undefined}
      >
        <div className="header-left">
          {/* Desktop: collapse sidebar, Mobile: open hamburger menu */}
          <button className="toggle-btn desktop-only" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <button className="toggle-btn mobile-only" onClick={toggleMobileMenu}>
            <Menu size={20} />
          </button>

          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search patients, appointments, doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          {/* Test notification button */}
          {notificationPermission === 'granted' && (
            <button
              className="header-btn"
              onClick={handleTestNotification}
              title="Send Test Notification"
            >
              <BellRing size={18} />
            </button>
          )}

          {notificationPermission === 'denied' && (
            <button className="header-btn" title="Notifications blocked — enable in browser settings" style={{ cursor: 'not-allowed' }}>
              <BellOff size={18} style={{ opacity: 0.4 }} />
            </button>
          )}

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="header-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge" />}
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <h3>Notifications ({unreadCount})</h3>
                  <button onClick={markAllNotificationsRead}>Mark all read</button>
                </div>
                <div className="notification-dropdown-list">
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <div className={`notification-dot ${notification.type}`} />
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="header-btn" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              title={displayName}
              style={{ width: 36, height: 36, borderRadius: '50%', marginLeft: 8, cursor: 'pointer' }}
            />
          ) : (
            <div className="user-avatar" title={displayName}>
              {initials}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
