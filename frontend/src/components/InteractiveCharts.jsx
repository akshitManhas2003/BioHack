import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import { getApiUrl } from '../utils/apiConfig';
import '../styles/InteractiveCharts.css';

export default function InteractiveCharts() {
  const [chartData, setChartData] = useState({
    trend: [],
    comparison: [],
    distribution: [],
    risk: [],
    radar: [],
  });
  const [activeTab, setActiveTab] = useState('trend');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      // Simulated data - In production, fetch from backend endpoints
      const trendData = [
        { date: 'Week 1', cases: 45, recovered: 32, hospitalized: 8 },
        { date: 'Week 2', cases: 52, recovered: 38, hospitalized: 10 },
        { date: 'Week 3', cases: 48, recovered: 41, hospitalized: 9 },
        { date: 'Week 4', cases: 61, recovered: 45, hospitalized: 12 },
        { date: 'Week 5', cases: 55, recovered: 48, hospitalized: 11 },
        { date: 'Week 6', cases: 67, recovered: 52, hospitalized: 13 },
      ];

      const comparisonData = [
        { name: 'Human Cases', value: 283 },
        { name: 'Animal Cases', value: 157 },
        { name: 'Environmental', value: 98 },
        { name: 'Alerts Issued', value: 215 },
      ];

      const distributionData = [
        { severity: 'Low', count: 45, fill: '#10b981' },
        { severity: 'Medium', count: 120, fill: '#f59e0b' },
        { severity: 'High', count: 85, fill: '#ef4444' },
        { severity: 'Critical', count: 30, fill: '#dc2626' },
      ];

      const riskData = [
        { category: 'Outbreak', value: 75 },
        { category: 'Transmission', value: 88 },
        { category: 'Hospitalization', value: 65 },
        { category: 'Mortality', value: 32 },
        { category: 'Public Health', value: 92 },
        { category: 'Animal Health', value: 78 },
      ];

      const radarData = [
        { metric: 'Detection Rate', value: 85 },
        { metric: 'Response Time', value: 72 },
        { metric: 'Recovery Rate', value: 68 },
        { metric: 'Prevention', value: 80 },
        { metric: 'Surveillance', value: 90 },
      ];

      setChartData({
        trend: trendData,
        comparison: comparisonData,
        distribution: distributionData,
        risk: riskData,
        radar: radarData,
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="interactive-charts">
      <div className="charts-header">
        <h2>Interactive Analytics</h2>
        <button
          className="refresh-chart-btn"
          onClick={fetchChartData}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Chart Tabs */}
      <div className="chart-tabs">
        <button
          className={`tab-btn ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          📈 Trends
        </button>
        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          📊 Comparison
        </button>
        <button
          className={`tab-btn ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          🎯 Distribution
        </button>
        <button
          className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('risk')}
        >
          ⚠️ Risk Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          🎪 Performance
        </button>
      </div>

      {/* Chart Content */}
      <div className="chart-container">
        {loading ? (
          <div className="chart-loading">
            <div className="spinner"></div>
            Loading charts...
          </div>
        ) : (
          <>
            {/* Trend Chart */}
            {activeTab === 'trend' && (
              <div className="chart-wrapper">
                <h3>Case Trends Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cases"
                      fill="#3b82f6"
                      stroke="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Line
                      type="monotone"
                      dataKey="recovered"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hospitalized"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Comparison Chart */}
            {activeTab === 'comparison' && (
              <div className="chart-wrapper">
                <h3>Cases by Type</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Distribution Chart */}
            {activeTab === 'distribution' && (
              <div className="chart-wrapper">
                <h3>Severity Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={chartData.distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={(entry) => `${entry.severity}: ${entry.count}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Risk Analysis */}
            {activeTab === 'risk' && (
              <div className="chart-wrapper">
                <h3>Risk Level Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.risk} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis dataKey="category" type="category" stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Radar Chart */}
            {activeTab === 'radar' && (
              <div className="chart-wrapper">
                <h3>Performance Metrics</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={chartData.radar}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#667eea"
                      fill="#667eea"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
