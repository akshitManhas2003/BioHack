import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getApiUrl } from '../utils/apiConfig';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Users, Wind, Droplets } from 'lucide-react';
import '../styles/MapView.css';

// Fix Leaflet default markers
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersGroup = useRef(L.featureGroup());
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    human: true,
    animal: true,
    environmental: true,
    alerts: true,
  });

  useEffect(() => {
    // Initialize map
    if (map.current === null) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      markersGroup.current.addTo(map.current);
    }

    // Fetch map data
    fetchMapData();

    // Refresh data every minute
    const interval = setInterval(fetchMapData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update map when filters change
    updateMapDisplay();
  }, [filters, mapData]);

  const fetchMapData = async () => {
    try {
      const response = await fetch(getApiUrl('/api/alerts/map/data'));
      const data = await response.json();
      setMapData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setLoading(false);
    }
  };

  const updateMapDisplay = () => {
    markersGroup.current.clearLayers();

    mapData.forEach((point) => {
      if (!filters[point.type]) return;

      const { latitude, longitude, type, details } = point;

      if (!latitude || !longitude) return;

      let color, icon;

      switch (type) {
        case 'human':
          color = '#FF0000'; // Red for human
          icon = L.divIcon({
            className: 'human-marker',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14],
          });
          break;
        case 'animal':
          color = '#FFD700'; // Gold for animal
          icon = L.divIcon({
            className: 'animal-marker',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14],
          });
          break;
        case 'environmental':
          color = '#00AA00'; // Green for environmental
          icon = L.divIcon({
            className: 'env-marker',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14],
          });
          break;
        case 'alert':
          color = '#8B0000'; // Dark red for alerts
          icon = L.divIcon({
            className: 'alert-marker',
            html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid yellow; box-shadow: 0 0 6px rgba(255,255,0,0.5);"></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -17],
          });
          break;
        default:
          icon = DefaultIcon;
      }

      const popup = createPopup(point);
      const marker = L.marker([latitude, longitude], { icon }).bindPopup(popup);
      markersGroup.current.addLayer(marker);
    });

    if (mapData.length > 0) {
      map.current.fitBounds(markersGroup.current.getBounds(), { padding: [50, 50] });
    }
  };

  const createPopup = (point) => {
    let html = `
      <div class="map-popup">
        <h4>${point.location_name}</h4>
        <p><strong>Type:</strong> ${point.type}</p>
        <p><strong>Date:</strong> ${new Date(point.created_at).toLocaleString()}</p>
    `;

    if (point.type === 'human') {
      html += `
        <p><strong>Case Type:</strong> ${point.details.case_type}</p>
        <p><strong>Severity:</strong> ${point.severity}</p>
        <p><strong>Symptoms:</strong> ${point.details.symptoms?.join(', ')}</p>
      `;
    } else if (point.type === 'animal') {
      html += `
        <p><strong>Species:</strong> ${point.species}</p>
        <p><strong>Mortality:</strong> ${point.details.mortality}</p>
        <p><strong>Morbidity:</strong> ${point.details.morbidity}</p>
      `;
    } else if (point.type === 'environmental') {
      html += `
        <p><strong>Sample Type:</strong> ${point.sample_type}</p>
        <p><strong>Pathogens:</strong> ${point.details.pathogens?.join(', ') || 'None detected'}</p>
      `;
    } else if (point.type === 'alert') {
      html += `
        <p><strong>Risk Level:</strong> <span class="badge" style="background-color: ${getRiskLevelColor(point.severity)}">${point.severity}</span></p>
        <p><strong>Description:</strong> ${point.details.description}</p>
      `;
    }

    html += '</div>';
    return html;
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return '#8B0000';
      case 'high':
        return '#FF0000';
      case 'moderate':
        return '#FFA500';
      case 'low':
        return '#FFFF00';
      default:
        return '#808080';
    }
  };

  const toggleFilter = (type) => {
    setFilters({
      ...filters,
      [type]: !filters[type],
    });
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="text-2xl font-bold text-white">Surveillance Map</h2>
        <div className="map-controls">
          <button
            className={`filter-btn ${filters.human ? 'active' : ''}`}
            onClick={() => toggleFilter('human')}
          >
            <Users className="w-4 h-4" /> Human Cases
          </button>
          <button
            className={`filter-btn ${filters.animal ? 'active' : ''}`}
            onClick={() => toggleFilter('animal')}
          >
            <Wind className="w-4 h-4" /> Animal Events
          </button>
          <button
            className={`filter-btn ${filters.environmental ? 'active' : ''}`}
            onClick={() => toggleFilter('environmental')}
          >
            <Droplets className="w-4 h-4" /> Environmental
          </button>
          <button
            className={`filter-btn ${filters.alerts ? 'active' : ''}`}
            onClick={() => toggleFilter('alerts')}
          >
            <AlertTriangle className="w-4 h-4" /> Alerts
          </button>
        </div>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF0000' }}></div>
          <span>Human Cases</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
          <span>Animal Events</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00AA00' }}></div>
          <span>Environmental</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8B0000' }}></div>
          <span>Alerts</span>
        </div>
      </div>

      <div
        ref={mapContainer}
        className="map-canvas"
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
      />

      {loading && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Loading map data...</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
