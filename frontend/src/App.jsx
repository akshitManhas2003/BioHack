import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Wind, Droplets } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MapView from './components/MapView';
import DataSubmission from './pages/DataSubmission';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorAlert from './components/ErrorAlert';
import { ErrorHandler } from './utils/errorHandler';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState({
    total_human_cases: 0,
    total_animal_events: 0,
    total_environmental_samples: 0,
    active_alerts: 0,
    high_risk_alerts: 0,
    critical_alerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/alerts/dashboard/stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      const enhancedError = await ErrorHandler.handle(err, 'fetchDashboardStats');
      setError(enhancedError);
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchDashboardStats();
    setRetrying(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} onRefresh={fetchDashboardStats} />;
      case 'map':
        return <MapView />;
      case 'submit':
        return <DataSubmission onDataSubmitted={fetchDashboardStats} />;
      default:
        return <Dashboard stats={stats} onRefresh={fetchDashboardStats} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-emerald-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">One Health Surveillance</h1>
                  <p className="text-xs text-slate-400">Integrated Disease Monitoring System</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    currentPage === 'dashboard'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('map')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    currentPage === 'map'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setCurrentPage('submit')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    currentPage === 'submit'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  Submit Data
                </button>
              </div>
            </div>

            {/* Alert Bar */}
            {stats.critical_alerts > 0 && (
              <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-200" />
                <span className="text-red-100 font-semibold">
                  ⚠️ {stats.critical_alerts} CRITICAL ALERT{stats.critical_alerts !== 1 ? 'S' : ''} - IMMEDIATE ACTION REQUIRED
                </span>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <ErrorAlert
              error={error}
              onRetry={handleRetry}
              onDismiss={() => setError(null)}
              severity="error"
            />
          )}

          {loading && currentPage === 'dashboard' ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading surveillance data...</p>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-400 text-sm">
            <p>One Health Surveillance System © 2024 | Real-time monitoring for zoonotic disease prevention</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
