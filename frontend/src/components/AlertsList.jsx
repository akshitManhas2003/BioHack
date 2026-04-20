import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Archive } from 'lucide-react';

const AlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const { getApiUrl } = await import('../utils/apiConfig');
      const response = await fetch(getApiUrl('/api/alerts/active'));
      const data = await response.json();
      setAlerts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'from-red-900 to-red-800 border-red-700';
      case 'high':
        return 'from-orange-900 to-orange-800 border-orange-700';
      case 'moderate':
        return 'from-yellow-900 to-yellow-800 border-yellow-700';
      case 'low':
        return 'from-green-900 to-green-800 border-green-700';
      default:
        return 'from-slate-900 to-slate-800 border-slate-700';
    }
  };

  const getRiskLevelBadgeColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-900 text-red-200';
      case 'high':
        return 'bg-orange-900 text-orange-200';
      case 'moderate':
        return 'bg-yellow-900 text-yellow-200';
      case 'low':
        return 'bg-green-900 text-green-200';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  const updateAlertStatus = async (alertId, newStatus) => {
    try {
      const { getApiUrl } = await import('../utils/apiConfig');
      await fetch(getApiUrl(`/api/alerts/alert/${alertId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status: newStatus,
          changed_by: 'system',
          reason: 'Status updated from dashboard',
        }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
          <p className="text-slate-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <p className="text-slate-300 font-semibold">No active alerts</p>
        <p className="text-slate-500 text-sm">All systems operational</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-gradient-to-r ${getRiskLevelColor(alert.risk_level)} border rounded-lg p-4 transition hover:shadow-lg`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-200" />
                <h4 className="font-bold text-white text-sm">{alert.alert_id}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiskLevelBadgeColor(alert.risk_level)}`}>
                  {alert.risk_level.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-200 font-semibold">
                  {alert.alert_type.toUpperCase().replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-slate-100 text-sm mb-2">{alert.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {alert.distance_km && (
                  <div className="text-xs text-slate-200">
                    <span className="font-semibold">Distance:</span> {alert.distance_km.toFixed(2)} km
                  </div>
                )}
                {alert.time_diff_hours && (
                  <div className="text-xs text-slate-200">
                    <span className="font-semibold">Time Gap:</span> {alert.time_diff_hours.toFixed(1)} hours
                  </div>
                )}
              </div>

              {alert.recommendation && (
                <div className="bg-black bg-opacity-20 rounded p-2 mb-3">
                  <p className="text-xs text-slate-100">
                    <span className="font-semibold">Recommendation:</span> {alert.recommendation}
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-300">
                {new Date(alert.created_at).toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => updateAlertStatus(alert.alert_id, 'resolved')}
                className="p-2 bg-green-700 hover:bg-green-600 rounded text-white transition"
                title="Mark as resolved"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateAlertStatus(alert.alert_id, 'archived')}
                className="p-2 bg-slate-600 hover:bg-slate-500 rounded text-white transition"
                title="Archive alert"
              >
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
