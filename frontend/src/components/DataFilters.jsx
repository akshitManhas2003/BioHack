import React, { useState } from 'react';
import { Filter, X, Download } from 'lucide-react';
import '../styles/DataFilters.css';

export default function DataFilters({ onFilterChange, onExport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    caseType: 'all',
    severity: 'all',
    region: 'all',
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      caseType: 'all',
      severity: 'all',
      region: 'all',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getWeekAgoDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };

  const getMonthAgoDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || 
                          filters.caseType !== 'all' || 
                          filters.severity !== 'all' || 
                          filters.region !== 'all';

  return (
    <div className="data-filters">
      <button
        className={`filter-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={20} />
        Filters
        {hasActiveFilters && <span className="active-badge">!</span>}
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Advanced Filters</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="filter-content">
            {/* Date Range */}
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <div>
                  <label className="small-label">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    max={getTodayDate()}
                  />
                </div>
                <div>
                  <label className="small-label">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    max={getTodayDate()}
                  />
                </div>
              </div>

              <div className="quick-dates">
                <button
                  className="quick-date-btn"
                  onClick={() => {
                    handleFilterChange('dateFrom', getWeekAgoDate());
                    handleFilterChange('dateTo', getTodayDate());
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  className="quick-date-btn"
                  onClick={() => {
                    handleFilterChange('dateFrom', getMonthAgoDate());
                    handleFilterChange('dateTo', getTodayDate());
                  }}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Case Type */}
            <div className="filter-group">
              <label>Case Type</label>
              <select
                value={filters.caseType}
                onChange={(e) => handleFilterChange('caseType', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="human">Human Cases</option>
                <option value="animal">Animal Cases</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>

            {/* Severity */}
            <div className="filter-group">
              <label>Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Region */}
            <div className="filter-group">
              <label>Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>

          <div className="filter-footer">
            <button
              className="reset-btn"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
            <button
              className="export-btn"
              onClick={() => onExport(filters)}
            >
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
