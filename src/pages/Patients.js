import React, { useState, useMemo } from 'react';
import {
  Search, UserPlus, X, Eye, LayoutGrid, List,
  Phone, Mail, Calendar, Stethoscope, Shield, AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusBadge = (status) => {
  const map = { Active: 'badge-success', Critical: 'badge-danger', Discharged: 'badge-gray' };
  return map[status] || 'badge-gray';
};

const riskBadge = (risk) => {
  const map = { Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger' };
  return map[risk] || 'badge-gray';
};

const riskDot = (risk) => {
  const map = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };
  return map[risk] || '#9ca3af';
};

const statusDot = (status) => {
  const map = { Active: '#10b981', Critical: '#ef4444', Discharged: '#9ca3af' };
  return map[status] || '#9ca3af';
};

function PatientGridCard({ patient, onView }) {
  return (
    <div className="patient-grid-card" onClick={() => onView(patient)}>
      {/* Top accent bar based on risk */}
      <div
        className="patient-grid-card-accent"
        style={{ background: riskDot(patient.riskLevel) }}
      />

      <div className="patient-grid-card-body">
        {/* Header: Avatar + Name */}
        <div className="patient-grid-card-header">
          <div className="patient-avatar" style={{ background: `linear-gradient(135deg, ${statusDot(patient.status)}, ${riskDot(patient.riskLevel)})` }}>
            {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="patient-grid-card-name">
            <h4>{patient.name}</h4>
            <span className="patient-grid-id">{patient.id}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="patient-grid-badges">
          <span className={`badge ${statusBadge(patient.status)}`}>{patient.status}</span>
          <span className={`badge ${riskBadge(patient.riskLevel)}`}>
            {patient.riskLevel === 'High' && <AlertTriangle size={10} style={{ marginRight: 3 }} />}
            {patient.riskLevel} Risk
          </span>
        </div>

        {/* Info rows */}
        <div className="patient-grid-info">
          <div className="patient-grid-info-row">
            <Stethoscope size={14} />
            <span>{patient.department}</span>
          </div>
          <div className="patient-grid-info-row">
            <Shield size={14} />
            <span>{patient.doctor}</span>
          </div>
          <div className="patient-grid-info-row">
            <Calendar size={14} />
            <span>{patient.condition}</span>
          </div>
          <div className="patient-grid-info-row">
            <Phone size={14} />
            <span>{patient.phone}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="patient-grid-footer">
          <div className="patient-grid-meta">
            <span>Age: {patient.age}</span>
            <span>{patient.gender}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); onView(patient); }}>
            <Eye size={14} /> View
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientListRow({ patient, onView }) {
  return (
    <div className="patient-list-row" onClick={() => onView(patient)}>
      <div className="patient-list-left">
        <div className="patient-avatar-sm" style={{ background: `linear-gradient(135deg, ${statusDot(patient.status)}, ${riskDot(patient.riskLevel)})` }}>
          {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="patient-list-name">
          <h4>{patient.name}</h4>
          <span>{patient.id} &middot; {patient.age}y &middot; {patient.gender}</span>
        </div>
      </div>

      <div className="patient-list-center">
        <div className="patient-list-detail">
          <Stethoscope size={13} />
          <span>{patient.department}</span>
        </div>
        <div className="patient-list-detail">
          <Shield size={13} />
          <span>{patient.doctor}</span>
        </div>
        <div className="patient-list-detail">
          <Calendar size={13} />
          <span>{patient.condition}</span>
        </div>
      </div>

      <div className="patient-list-contact">
        <div className="patient-list-detail">
          <Phone size={13} />
          <span>{patient.phone}</span>
        </div>
        <div className="patient-list-detail">
          <Mail size={13} />
          <span>{patient.email}</span>
        </div>
      </div>

      <div className="patient-list-right">
        <span className={`badge ${statusBadge(patient.status)}`}>{patient.status}</span>
        <span className={`badge ${riskBadge(patient.riskLevel)}`}>{patient.riskLevel}</span>
      </div>

      <button className="btn btn-outline btn-sm patient-list-action" onClick={(e) => { e.stopPropagation(); onView(patient); }}>
        <Eye size={14} />
      </button>
    </div>
  );
}

export default function Patients() {
  const { patients } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const departments = ['All', ...new Set(patients.map((p) => p.department))];
  const statuses = ['All', 'Active', 'Critical', 'Discharged'];
  const risks = ['All', 'Low', 'Medium', 'High'];

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchDept = departmentFilter === 'All' || p.department === departmentFilter;
      const matchRisk = riskFilter === 'All' || p.riskLevel === riskFilter;
      return matchSearch && matchStatus && matchDept && matchRisk;
    });
  }, [patients, search, statusFilter, departmentFilter, riskFilter]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>{filtered.length} of {patients.length} patients</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
          <button className="btn btn-primary">
            <UserPlus size={16} /> Add Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="filters-bar">
            <div className="search-bar" style={{ width: 280 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
            </select>
            <select className="filter-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              {departments.map((d) => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
            <select className="filter-select" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              {risks.map((r) => <option key={r} value={r}>{r === 'All' ? 'All Risk Levels' : r}</option>)}
            </select>
            {(statusFilter !== 'All' || departmentFilter !== 'All' || riskFilter !== 'All') && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setStatusFilter('All'); setDepartmentFilter('All'); setRiskFilter('All'); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content — Grid or List */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Search size={48} />
            <h3>No patients found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="patient-grid">
          {filtered.map((patient) => (
            <PatientGridCard key={patient.id} patient={patient} onView={setSelectedPatient} />
          ))}
        </div>
      ) : (
        <div className="patient-list">
          {/* List header */}
          <div className="patient-list-header">
            <span className="patient-list-header-left">Patient</span>
            <span className="patient-list-header-center">Department & Doctor</span>
            <span className="patient-list-header-contact">Contact</span>
            <span className="patient-list-header-right">Status</span>
            <span className="patient-list-header-action"></span>
          </div>
          {filtered.map((patient) => (
            <PatientListRow key={patient.id} patient={patient} onView={setSelectedPatient} />
          ))}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="patient-avatar" style={{ background: `linear-gradient(135deg, ${statusDot(selectedPatient.status)}, ${riskDot(selectedPatient.riskLevel)})` }}>
                  {selectedPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 style={{ fontSize: 18 }}>{selectedPatient.name}</h2>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{selectedPatient.id}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedPatient(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <span className={`badge ${statusBadge(selectedPatient.status)}`}>{selectedPatient.status}</span>
                <span className={`badge ${riskBadge(selectedPatient.riskLevel)}`}>{selectedPatient.riskLevel} Risk</span>
                <span className="badge badge-primary">{selectedPatient.department}</span>
              </div>
              <div className="patient-detail-grid">
                <div>
                  <div className="detail-row">
                    <span className="detail-label">Age / Gender</span>
                    <span className="detail-value">{selectedPatient.age} / {selectedPatient.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{selectedPatient.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedPatient.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Insurance</span>
                    <span className="detail-value">{selectedPatient.insurance}</span>
                  </div>
                </div>
                <div>
                  <div className="detail-row">
                    <span className="detail-label">Doctor</span>
                    <span className="detail-value">{selectedPatient.doctor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{selectedPatient.condition}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Visit</span>
                    <span className="detail-value">{selectedPatient.lastVisit}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Next Appointment</span>
                    <span className="detail-value">{selectedPatient.nextAppointment || 'Not scheduled'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
