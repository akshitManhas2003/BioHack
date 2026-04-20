import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Users, Wind, Droplets, Activity, RotateCw, TrendingUp, Download } from 'lucide-react';
import AlertsList from '../components/AlertsList';
import AdvancedCharts from '../components/AdvancedCharts';
import ErrorAlert from '../components/ErrorAlert';
import KPIDashboard from '../components/KPIDashboard';
import DataFilters from '../components/DataFilters';
import InteractiveCharts from '../components/InteractiveCharts';
import DataTable from '../components/DataTable';
import { ErrorHandler, ERROR_SEVERITY } from '../utils/errorHandler';
import { getApiUrl } from '../utils/apiConfig';
import '../styles/Dashboard.css';

const Dashboard = ({ stats, onRefresh }) => {
  const [alertStats, setAlertStats] = useState(null);
  const [humanStats, setHumanStats] = useState(null);
  const [animalStats, setAnimalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    caseType: 'all',
    severity: 'all',
    region: 'all',
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setError(null);
      const [alertRes, humanRes, animalRes] = await Promise.all([
        fetch(getApiUrl('/api/alerts/statistics')),
        fetch(getApiUrl('/api/human/stats')),
        fetch(getApiUrl('/api/animal/stats')),
      ]);

      // Check for response errors
      if (!alertRes.ok) throw new Error(`Alert stats failed: ${alertRes.status}`);
      if (!humanRes.ok) throw new Error(`Human stats failed: ${humanRes.status}`);
      if (!animalRes.ok) throw new Error(`Animal stats failed: ${animalRes.status}`);

      const alertData = await alertRes.json();
      const humanData = await humanRes.json();
      const animalData = await animalRes.json();

      setAlertStats(alertData);
      setHumanStats(humanData);
      setAnimalStats(animalData);
      setLoading(false);
    } catch (err) {
      const enhancedError = await ErrorHandler.handle(err, 'Dashboard.fetchAllStats');
      setError(enhancedError);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      await fetchAllStats();
    } catch (err) {
      const enhancedError = await ErrorHandler.handle(err, 'Dashboard.handleRefresh');
      setError(enhancedError);
    } finally {
      setRefreshing(false);
    }
  };

  const handleChartError = (errorMsg) => {
    setError(new Error(errorMsg));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // In production, would filter the tableData based on these filters
  };

  const handleExport = (currentFilters) => {
    // Create CSV content
    const headers = ['Type', 'Case ID', 'Date', 'Severity', 'Status', 'Location'];
    const csvContent = [
      headers.join(','),
      ...tableData.map(row =>
        `${row.type},${row.id},${row.date},${row.severity},${row.status},${row.location}`
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `surveillance-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical':
        return '#8B0000';
      case 'high':
        return '#FF0000';
      case 'moderate':
        return '#FFA500';
      case 'low':
        return '#22c55e';
      default:
        return '#808080';
    }
  };

  const CHART_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-900 border-t-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading surveillance data...</p>
          <p className="text-slate-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Error Alert */}
      {error && (
        <ErrorAlert
          error={error}
          onRetry={fetchAllStats}
          onDismiss={() => setError(null)}
          severity={ERROR_SEVERITY.ERROR}
        />
      )}

      {/* KPI Dashboard */}
      <KPIDashboard />

      {/* Filters and Export */}
      <DataFilters onFilterChange={handleFilterChange} onExport={handleExport} />

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h2>System Overview</h2>
            <p className="text-slate-400 text-sm mt-1">Real-time surveillance metrics and alerts</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`button-primary flex items-center gap-2 ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid-4">
        {/* Total Cases */}
        <div className="stat-card fade-in">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-emerald-500 bg-opacity-20 rounded-full">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="stat-label">Human Cases</p>
          <p className="stat-value">{stats.total_human_cases}</p>
          <p className="stat-description">Total reported cases</p>
        </div>

        {/* Animal Events */}
        <div className="stat-card fade-in">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-full">
              <Wind className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="stat-label">Animal Events</p>
          <p className="stat-value">{stats.total_animal_events}</p>
          <p className="stat-description">Total events recorded</p>
        </div>

        {/* Environmental Samples */}
        <div className="stat-card fade-in">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
              <Droplets className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="stat-label">Environmental</p>
          <p className="stat-value">{stats.total_environmental_samples}</p>
          <p className="stat-description">Samples collected</p>
        </div>

        {/* Active Alerts */}
        <div className={`stat-card danger fade-in ${stats.active_alerts > 0 ? 'animate-glow' : ''}`}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-red-500 bg-opacity-20 rounded-full">
              <Activity className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="stat-label">Active Alerts</p>
          <p className="stat-value">{stats.active_alerts}</p>
          <p className="stat-description">{stats.critical_alerts} critical</p>
        </div>
      </div>

      {/* Alert Priority Section */}
      {alertStats && (
        <div className="grid-2">
          {/* Alert Type Breakdown */}
          <div className="card slide-in-up">
            <h3 className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Alert Types Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertStats.alert_type_breakdown || []}
                  dataKey="count"
                  nameKey="alert_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(alertStats.alert_type_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Level Distribution */}
          <div className="card slide-in-up">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              Risk Level Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertStats.risk_level_breakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="risk_level" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Human & Animal Stats */}
      {humanStats && animalStats && (
        <div className="grid-2">
          {/* Human Case Breakdown */}
          <div className="card slide-in-up">
            <h3 className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Human Cases by Type
            </h3>
            <div className="space-y-2">
              {humanStats.case_type_breakdown?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg hover:from-slate-700 hover:to-slate-600 transition">
                  <span className="text-slate-300 font-semibold">{item.case_type}</span>
                  <span className="px-3 py-1 bg-emerald-500 bg-opacity-20 text-emerald-400 rounded-full font-bold text-sm">{item.count}</span>
                </div>
              ))}
              {humanStats.hospitalized > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-900 to-red-800 bg-opacity-40 border-2 border-red-700 rounded-lg">
                  <p className="text-red-100 font-semibold">
                    <AlertTriangle className="inline w-4 h-4 mr-2" />
                    Hospitalized: <span className="text-red-400 font-bold">{humanStats.hospitalized}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Animal Stats */}
          <div className="card slide-in-up">
            <h3 className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-yellow-400" />
              Animal Events by Species
            </h3>
            <div className="space-y-2">
              {animalStats.species_breakdown?.map((item, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg hover:from-slate-700 hover:to-slate-600 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-semibold">{item.species}</span>
                    <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full font-bold text-sm">{item.events}</span>
                  </div>
                  {item.total_mortality > 0 && (
                    <p className="text-red-400 text-xs font-semibold">
                      ⚠️ Mortality: {item.total_mortality}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts List */}
      <div className="card slide-in-up">
        <h3 className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Active Alerts
        </h3>
        <AlertsList />
      </div>

      {/* Advanced Analytics Charts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Advanced Analytics
        </h2>
        <AdvancedCharts onError={handleChartError} />
      </div>

      {/* Interactive Charts */}
      <InteractiveCharts />

      {/* Data Table */}
      <div className="mt-8" style={{ padding: '0 20px' }}>
        <DataTable
          data={[
            { type: 'Human', id: 'H001', date: '2024-01-15', severity: 'High', status: 'Active', location: 'Region A' },
            { type: 'Animal', id: 'A001', date: '2024-01-14', severity: 'Medium', status: 'Monitored', location: 'Region B' },
            { type: 'Environmental', id: 'E001', date: '2024-01-13', severity: 'Low', status: 'Resolved', location: 'Region C' },
          ]}
          columns={[
            { key: 'type', label: 'Type' },
            { key: 'id', label: 'Case ID' },
            { key: 'date', label: 'Date' },
            { key: 'severity', label: 'Severity' },
            { key: 'status', label: 'Status' },
            { key: 'location', label: 'Location' },
          ]}
          title="Surveillance Cases"
        />
      </div>
    </div>
  );
};

export default Dashboard;
