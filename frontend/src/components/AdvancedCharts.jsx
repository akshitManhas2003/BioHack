import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

const AdvancedCharts = ({ onError }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [severityDistribution, setSeverityDistribution] = useState([]);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartsData();
  }, []);

  const fetchChartsData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch comprehensive statistics
      const { getApiUrl } = await import('../utils/apiConfig');
      const [humanRes, animalRes, alertRes] = await Promise.all([
        fetch(getApiUrl('/api/human/cases?days=60')),
        fetch(getApiUrl('/api/animal/events?days=60')),
        fetch(getApiUrl('/api/alerts/active')),
      ]).catch(err => {
        throw new Error(`Network error: ${err.message}`);
      });

      if (!humanRes.ok) throw new Error(`Human data failed: ${humanRes.status}`);
      if (!animalRes.ok) throw new Error(`Animal data failed: ${animalRes.status}`);
      if (!alertRes.ok) throw new Error(`Alert data failed: ${alertRes.status}`);

      const humanData = await humanRes.json();
      const animalData = await animalRes.json();
      const alertData = await alertRes.json();

      processTimeSeriesData(humanData, animalData);
      processSeverityData(humanData);
      processCaseTypeData(humanData);
      processAgeGroupData(humanData);
      processTrendsData(alertData);

    } catch (err) {
      const errorMessage = `Failed to load charts: ${err.message}`;
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Charts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processTimeSeriesData = (humanData, animalData) => {
    const dateMap = {};
    
    // Process human cases
    humanData?.forEach(case_ => {
      const date = new Date(case_.created_at).toLocaleDateString();
      dateMap[date] = (dateMap[date] || { date, human: 0, animal: 0 });
      dateMap[date].human += 1;
    });

    // Process animal events
    animalData?.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString();
      dateMap[date] = (dateMap[date] || { date, human: 0, animal: 0 });
      dateMap[date].animal += 1;
    });

    setTimeSeriesData(Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const processSeverityData = (humanData) => {
    const severityMap = {};
    const SEVERITY_ORDER = { 'Low': 0, 'Moderate': 1, 'High': 2, 'Critical': 3 };
    
    humanData?.forEach(case_ => {
      const severity = case_.severity || 'Unknown';
      severityMap[severity] = (severityMap[severity] || 0) + 1;
    });

    const data = Object.entries(severityMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (SEVERITY_ORDER[a.name] || 999) - (SEVERITY_ORDER[b.name] || 999));
    
    setSeverityDistribution(data);
  };

  const processCaseTypeData = (humanData) => {
    const typeMap = {};
    
    humanData?.forEach(case_ => {
      const type = case_.case_type || 'Other';
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    setCaseTypeData(Object.entries(typeMap).map(([name, value]) => ({ name, value })));
  };

  const processAgeGroupData = (humanData) => {
    const ageGroups = {
      '0-10': 0, '11-20': 0, '21-30': 0, '31-40': 0,
      '41-50': 0, '51-60': 0, '60+': 0
    };

    humanData?.forEach(case_ => {
      const age = case_.age || 0;
      if (age <= 10) ageGroups['0-10']++;
      else if (age <= 20) ageGroups['11-20']++;
      else if (age <= 30) ageGroups['21-30']++;
      else if (age <= 40) ageGroups['31-40']++;
      else if (age <= 50) ageGroups['41-50']++;
      else if (age <= 60) ageGroups['51-60']++;
      else ageGroups['60+']++;
    });

    setAgeGroupData(Object.entries(ageGroups).map(([name, value]) => ({ name, value })));
  };

  const processTrendsData = (alertData) => {
    const riskLevelMap = {};
    
    alertData?.forEach(alert => {
      const riskLevel = alert.risk_level || 'Unknown';
      riskLevelMap[riskLevel] = (riskLevelMap[riskLevel] || 0) + 1;
    });

    setTrendsData(Object.entries(riskLevelMap).map(([name, value]) => ({ name, value })));
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
          <p className="text-slate-300">Loading advanced charts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-200 font-semibold">Error Loading Charts</h3>
          <p className="text-red-300 text-sm mt-1">{error}</p>
          <button
            onClick={fetchChartsData}
            className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 text-red-100 rounded text-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Time Series Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Case Trends (60 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Legend />
            <Bar dataKey="human" fill="#10b981" name="Human Cases" />
            <Line type="monotone" dataKey="animal" stroke="#3b82f6" name="Animal Events" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Case Severity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={severityDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Bar dataKey="value" fill="#f59e0b" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Case Type Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Case Types Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={caseTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {caseTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age Group Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Age Group Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ageGroupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#1d4ed8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Level Radar */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Alert Risk Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={trendsData}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
            <PolarRadiusAxis stroke="#94a3b8" />
            <Radar name="Alert Count" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvancedCharts;
