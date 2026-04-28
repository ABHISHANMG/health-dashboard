import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { patients as initialPatients, appointments as initialAppointments, notifications as initialNotifications } from '../data/mockData';
import useNotifications from '../hooks/useNotifications';

const AppContext = createContext();

const initialState = {
  patients: initialPatients,
  appointments: initialAppointments,
  notifications: initialNotifications,
  sidebarCollapsed: false,
  searchQuery: '',
  activeFilters: {},
};

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_FILTER':
      return {
        ...state,
        activeFilters: { ...state.activeFilters, [action.payload.key]: action.payload.value },
      };

    case 'CLEAR_FILTERS':
      return { ...state, activeFilters: {} };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'UPDATE_APPOINTMENT_STATUS':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, status: action.payload.status } : a
        ),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isSupported, permission, requestPermission, sendNotification } = useNotifications();

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSearchQuery = useCallback((query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }), []);
  const setFilter = useCallback((key, value) => dispatch({ type: 'SET_FILTER', payload: { key, value } }), []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);
  const markNotificationRead = useCallback((id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }), []);
  const markAllNotificationsRead = useCallback(() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' }), []);
  const updateAppointmentStatus = useCallback((id, status) =>
    dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } }), []);

  // Add an in-app notification AND trigger a push/local OS notification
  const addNotification = useCallback(({ type, message, pushTitle, pushBody, url }) => {
    const id = Date.now();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, type: type || 'info', message, time: 'Just now', read: false },
    });

    // Also fire an OS-level notification via service worker
    if (permission === 'granted') {
      sendNotification({
        title: pushTitle || 'MedFlow',
        body: pushBody || message,
        tag: `medflow-${id}`,
        url: url || '/',
      });
    }
  }, [permission, sendNotification]);

  // Working use case: Appointment reminder — fires 60s after mount to simulate
  // "upcoming appointment in 15 minutes" alert
  useEffect(() => {
    if (permission !== 'granted') return;

    const nextAppointment = state.appointments.find((a) => a.status === 'Confirmed');
    if (!nextAppointment) return;

    const timer = setTimeout(() => {
      addNotification({
        type: 'appointment',
        message: `Reminder: ${nextAppointment.patientName} appointment with ${nextAppointment.doctor} at ${nextAppointment.time}`,
        pushTitle: 'Appointment Reminder',
        pushBody: `${nextAppointment.patientName} — ${nextAppointment.time} with ${nextAppointment.doctor}`,
        url: '/appointments',
      });
    }, 60000); // fires after 1 minute

    return () => clearTimeout(timer);
  // Run once after permission granted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  const value = {
    ...state,
    toggleSidebar,
    setSearchQuery,
    setFilter,
    clearFilters,
    markNotificationRead,
    markAllNotificationsRead,
    updateAppointmentStatus,
    addNotification,
    // Notification system
    notificationPermission: permission,
    notificationSupported: isSupported,
    requestNotificationPermission: requestPermission,
    sendPushNotification: sendNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
