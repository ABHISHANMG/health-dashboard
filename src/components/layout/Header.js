import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
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

  return (
    <header className={`header ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="header-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? <Menu size={20} /> : <Menu size={20} />}
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
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="header-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h3>Notifications ({unreadCount})</h3>
                <button onClick={markAllNotificationsRead}>Mark all read</button>
              </div>
              {notifications.map((notification) => (
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
              ))}
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
  );
}
