import React, { useState, useMemo } from 'react';
import { Search, Filter, UserPlus, X, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Patients() {
  const { patients } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const statusBadge = (status) => {
    const map = { Active: 'badge-success', Critical: 'badge-danger', Discharged: 'badge-gray' };
    return map[status] || 'badge-gray';
  };

  const riskBadge = (risk) => {
    const map = { Low: 'badge-success', Medium: 'badge-warning', High: 'badge-danger' };
    return map[risk] || 'badge-gray';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>{patients.length} total patients registered</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={16} /> Add Patient
        </button>
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

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Condition</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{patient.id}</td>
                  <td style={{ fontWeight: 500 }}>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.department}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.condition}</td>
                  <td><span className={`badge ${riskBadge(patient.riskLevel)}`}>{patient.riskLevel}</span></td>
                  <td><span className={`badge ${statusBadge(patient.status)}`}>{patient.status}</span></td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                    No patients match your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Patient Details — {selectedPatient.name}</h2>
              <button className="modal-close" onClick={() => setSelectedPatient(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="patient-detail-grid">
                <div>
                  <div className="detail-row">
                    <span className="detail-label">Patient ID</span>
                    <span className="detail-value">{selectedPatient.id}</span>
                  </div>
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
                </div>
                <div>
                  <div className="detail-row">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{selectedPatient.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Doctor</span>
                    <span className="detail-value">{selectedPatient.doctor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Insurance</span>
                    <span className="detail-value">{selectedPatient.insurance}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Condition</span>
                    <span className="detail-value">{selectedPatient.condition}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="detail-row">
                  <span className="detail-label">Last Visit</span>
                  <span className="detail-value">{selectedPatient.lastVisit}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Next Appointment</span>
                  <span className="detail-value">{selectedPatient.nextAppointment || 'Not scheduled'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Risk Level</span>
                  <span className={`badge ${riskBadge(selectedPatient.riskLevel)}`}>{selectedPatient.riskLevel}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`badge ${statusBadge(selectedPatient.status)}`}>{selectedPatient.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
