import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Users, Activity, Zap } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';
import '../styles/KPIDashboard.css';

export default function KPIDashboard() {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    recoveryRate: 0,
    criticalAlerts: 0,
    animationDelay: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/statistics/summary'));
      const data = await response.json();

      setStats({
        totalCases: data.total_human_cases || 0,
        activeCases: data.total_alerts || 0,
        recoveryRate: Math.round((data.human_hospitalized / (data.total_human_cases || 1)) * 100) || 0,
        criticalAlerts: data.critical_alerts || 0,
      });
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const KPICard = ({ icon: Icon, title, value, trend, unit = '', color }) => {
    const trendIsPositive = trend > 0;

    return (
      <div className={`kpi-card ${color}`}>
        <div className="kpi-header">
          <div className="kpi-icon">
            <Icon size={24} />
          </div>
          <div className="kpi-trend">
            {trendIsPositive ? (
              <TrendingUp size={16} className="trend-up" />
            ) : (
              <TrendingDown size={16} className="trend-down" />
            )}
            <span className={trendIsPositive ? 'trend-up' : 'trend-down'}>
              {Math.abs(trend)}%
            </span>
          </div>
        </div>

        <h3 className="kpi-title">{title}</h3>

        {loading ? (
          <div className="kpi-skeleton">
            <div className="skeleton-bar"></div>
          </div>
        ) : (
          <div className="kpi-value">
            <span className="value-number">{value}</span>
            {unit && <span className="value-unit">{unit}</span>}
          </div>
        )}

        <div className="kpi-footer">
          <small>vs last week</small>
        </div>
      </div>
    );
  };

  return (
    <div className="kpi-dashboard">
      <div className="kpi-header-section">
        <h2>Dashboard Overview</h2>
        <button
          className="refresh-btn"
          onClick={fetchKPIData}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="kpi-grid">
        <KPICard
          icon={Users}
          title="Total Cases"
          value={stats.totalCases}
          trend={12}
          color="blue"
        />

        <KPICard
          icon={Activity}
          title="Active Cases"
          value={stats.activeCases}
          trend={-5}
          color="green"
        />

        <KPICard
          icon={AlertCircle}
          title="Recovery Rate"
          value={stats.recoveryRate}
          trend={8}
          unit="%"
          color="purple"
        />

        <KPICard
          icon={Zap}
          title="Critical Alerts"
          value={stats.criticalAlerts}
          trend={-15}
          color="red"
        />
      </div>
    </div>
  );
}
