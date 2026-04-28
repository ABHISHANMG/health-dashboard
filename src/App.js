import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Analytics from './pages/Analytics';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="*" element={
                <div className="empty-state">
                  <h3>Page Not Found</h3>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
