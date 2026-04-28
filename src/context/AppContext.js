import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { patients as initialPatients, appointments as initialAppointments, notifications as initialNotifications } from '../data/mockData';

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

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSearchQuery = useCallback((query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }), []);
  const setFilter = useCallback((key, value) => dispatch({ type: 'SET_FILTER', payload: { key, value } }), []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);
  const markNotificationRead = useCallback((id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }), []);
  const markAllNotificationsRead = useCallback(() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' }), []);
  const updateAppointmentStatus = useCallback((id, status) =>
    dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } }), []);

  const value = {
    ...state,
    toggleSidebar,
    setSearchQuery,
    setFilter,
    clearFilters,
    markNotificationRead,
    markAllNotificationsRead,
    updateAppointmentStatus,
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
