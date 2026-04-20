import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Users, Wind, Droplets, Send } from 'lucide-react';

const DataSubmission = ({ onDataSubmitted }) => {
  const [activeTab, setActiveTab] = useState('human');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Human Data Form
  const [humanForm, setHumanForm] = useState({
    patient_name: '',
    age: '',
    gender: '',
    symptoms: [],
    case_type: 'respiratory',
    severity: 'mild',
    location_name: '',
    latitude: '',
    longitude: '',
    contact_count: '',
    hospitalized: false,
    reported_by: 'field_worker_01',
  });

  // Animal Data Form
  const [animalForm, setAnimalForm] = useState({
    species: 'poultry',
    species_detail: '',
    population_count: '',
    mortality_count: '',
    morbidity_count: '',
    location_name: '',
    latitude: '',
    longitude: '',
    clinical_signs: [],
    reported_by: 'field_worker_01',
    farm_id: '',
    vaccination_status: '',
  });

  // Environmental Data Form
  const [envForm, setEnvForm] = useState({
    sample_type: 'water',
    location_name: '',
    latitude: '',
    longitude: '',
    temperature: '',
    humidity: '',
    water_quality_ph: '',
    water_turbidity: '',
    pathogen_detected: [],
    pollutant_level: '',
    pollutant_type: '',
    air_quality_index: '',
    notes: '',
    reported_by: 'field_worker_01',
  });

  const handleHumanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { getApiUrl } = await import('../utils/apiConfig');
      const response = await fetch(getApiUrl('/api/human/reports'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(humanForm),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `✓ Human case submitted successfully: ${data.case_id}` });
        setHumanForm({
          patient_name: '',
          age: '',
          gender: '',
          symptoms: [],
          case_type: 'respiratory',
          severity: 'mild',
          location_name: '',
          latitude: '',
          longitude: '',
          contact_count: '',
          hospitalized: false,
          reported_by: 'field_worker_01',
        });
        onDataSubmitted();
      } else {
        setMessage({ type: 'error', text: '✗ Failed to submit human case report' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `✗ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleAnimalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { getApiUrl } = await import('../utils/apiConfig');
      const response = await fetch(getApiUrl('/api/animal/reports'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalForm),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `✓ Animal event submitted successfully: ${data.event_id}` });
        setAnimalForm({
          species: 'poultry',
          species_detail: '',
          population_count: '',
          mortality_count: '',
          morbidity_count: '',
          location_name: '',
          latitude: '',
          longitude: '',
          clinical_signs: [],
          reported_by: 'field_worker_01',
          farm_id: '',
          vaccination_status: '',
        });
        onDataSubmitted();
      } else {
        setMessage({ type: 'error', text: '✗ Failed to submit animal event report' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `✗ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEnvSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { getApiUrl } = await import('../utils/apiConfig');
      const response = await fetch(getApiUrl('/api/environmental/reports'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envForm),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `✓ Environmental sample submitted successfully: ${data.sample_id}` });
        setEnvForm({
          sample_type: 'water',
          location_name: '',
          latitude: '',
          longitude: '',
          temperature: '',
          humidity: '',
          water_quality_ph: '',
          water_turbidity: '',
          pathogen_detected: [],
          pollutant_level: '',
          pollutant_type: '',
          air_quality_index: '',
          notes: '',
          reported_by: 'field_worker_01',
        });
        onDataSubmitted();
      } else {
        setMessage({ type: 'error', text: '✗ Failed to submit environmental report' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `✗ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({ label, error, required, children }) => (
    <div className="space-y-2">
      <label className="block text-slate-200 font-semibold text-sm">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  const renderHumanForm = () => (
    <form onSubmit={handleHumanSubmit} className="space-y-6">
      <div className="grid-2">
        <FormField label="Patient Name" required>
          <input
            type="text"
            maxLength="100"
            required
            value={humanForm.patient_name}
            onChange={(e) => setHumanForm({ ...humanForm, patient_name: e.target.value })}
            placeholder="Enter full patient name"
          />
        </FormField>
        <FormField label="Age">
          <input
            type="number"
            min="0"
            max="150"
            value={humanForm.age}
            onChange={(e) => setHumanForm({ ...humanForm, age: e.target.value })}
            placeholder="Age in years"
          />
        </FormField>
      </div>

      <div className="grid-2">
        <FormField label="Gender">
          <select
            value={humanForm.gender}
            onChange={(e) => setHumanForm({ ...humanForm, gender: e.target.value })}
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </FormField>
        <FormField label="Case Type">
          <select
            value={humanForm.case_type}
            onChange={(e) => setHumanForm({ ...humanForm, case_type: e.target.value })}
          >
            <option value="respiratory">Respiratory</option>
            <option value="gastrointestinal">Gastrointestinal</option>
            <option value="other">Other</option>
          </select>
        </FormField>
      </div>

      <div className="grid-2">
        <FormField label="Severity Level">
          <select
            value={humanForm.severity}
            onChange={(e) => setHumanForm({ ...humanForm, severity: e.target.value })}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
            <option value="critical">Critical</option>
          </select>
        </FormField>
        <FormField label="Hospitalization Status">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={humanForm.hospitalized}
              onChange={(e) => setHumanForm({ ...humanForm, hospitalized: e.target.checked })}
              className="w-5 h-5 rounded accent-emerald-500"
            />
            <span>Patient is hospitalized</span>
          </label>
        </FormField>
      </div>

      <FormField label="Location" required>
        <input
          type="text"
          required
          value={humanForm.location_name}
          onChange={(e) => setHumanForm({ ...humanForm, location_name: e.target.value })}
          placeholder="District, City or Area"
        />
      </FormField>

      <div className="grid-2">
        <FormField label="Latitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={humanForm.latitude}
            onChange={(e) => setHumanForm({ ...humanForm, latitude: e.target.value })}
            placeholder="e.g., 28.6139"
          />
        </FormField>
        <FormField label="Longitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={humanForm.longitude}
            onChange={(e) => setHumanForm({ ...humanForm, longitude: e.target.value })}
            placeholder="e.g., 77.2090"
          />
        </FormField>
      </div>

      <FormField label="Contact Count">
        <input
          type="number"
          value={humanForm.contact_count}
          onChange={(e) => setHumanForm({ ...humanForm, contact_count: e.target.value })}
          placeholder="Number of close contacts"
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className={`button-primary w-full flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Send className="w-4 h-4" />
        {loading ? 'Submitting...' : 'Submit Human Case Report'}
      </button>
    </form>
  );

  const renderAnimalForm = () => (
    <form onSubmit={handleAnimalSubmit} className="space-y-6">
      <div className="grid-2">
        <FormField label="Species" required>
          <select
            value={animalForm.species}
            onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
          >
            <option value="poultry">Poultry</option>
            <option value="swine">Swine</option>
            <option value="cattle">Cattle</option>
            <option value="wild_bird">Wild Bird</option>
          </select>
        </FormField>
        <FormField label="Species Detail">
          <input
            type="text"
            value={animalForm.species_detail}
            onChange={(e) => setAnimalForm({ ...animalForm, species_detail: e.target.value })}
            placeholder="e.g., Layer hens, Broilers"
          />
        </FormField>
      </div>

      <div className="grid-3">
        <FormField label="Population Count">
          <input
            type="number"
            value={animalForm.population_count}
            onChange={(e) => setAnimalForm({ ...animalForm, population_count: e.target.value })}
            placeholder="Total animals"
          />
        </FormField>
        <FormField label="Mortality Count" required>
          <input
            type="number"
            required
            value={animalForm.mortality_count}
            onChange={(e) => setAnimalForm({ ...animalForm, mortality_count: e.target.value })}
            placeholder="Deaths"
          />
        </FormField>
        <FormField label="Morbidity Count" required>
          <input
            type="number"
            required
            value={animalForm.morbidity_count}
            onChange={(e) => setAnimalForm({ ...animalForm, morbidity_count: e.target.value })}
            placeholder="Sick animals"
          />
        </FormField>
      </div>

      <FormField label="Location" required>
        <input
          type="text"
          required
          value={animalForm.location_name}
          onChange={(e) => setAnimalForm({ ...animalForm, location_name: e.target.value })}
          placeholder="Farm location"
        />
      </FormField>

      <div className="grid-2">
        <FormField label="Latitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={animalForm.latitude}
            onChange={(e) => setAnimalForm({ ...animalForm, latitude: e.target.value })}
            placeholder="e.g., 28.6139"
          />
        </FormField>
        <FormField label="Longitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={animalForm.longitude}
            onChange={(e) => setAnimalForm({ ...animalForm, longitude: e.target.value })}
            placeholder="e.g., 77.2090"
          />
        </FormField>
      </div>

      <div className="grid-2">
        <FormField label="Farm ID">
          <input
            type="text"
            value={animalForm.farm_id}
            onChange={(e) => setAnimalForm({ ...animalForm, farm_id: e.target.value })}
            placeholder="Farm identifier"
          />
        </FormField>
        <FormField label="Vaccination Status">
          <input
            type="text"
            value={animalForm.vaccination_status}
            onChange={(e) => setAnimalForm({ ...animalForm, vaccination_status: e.target.value })}
            placeholder="e.g., Vaccinated, Not vaccinated"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`button-primary w-full flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Send className="w-4 h-4" />
        {loading ? 'Submitting...' : 'Submit Animal Event Report'}
      </button>
    </form>
  );

  const renderEnvForm = () => (
    <form onSubmit={handleEnvSubmit} className="space-y-6">
      <div className="grid-2">
        <FormField label="Sample Type" required>
          <select
            value={envForm.sample_type}
            onChange={(e) => setEnvForm({ ...envForm, sample_type: e.target.value })}
          >
            <option value="water">Water</option>
            <option value="air">Air</option>
            <option value="soil">Soil</option>
            <option value="feed">Feed</option>
          </select>
        </FormField>
        <FormField label="Location" required>
          <input
            type="text"
            required
            value={envForm.location_name}
            onChange={(e) => setEnvForm({ ...envForm, location_name: e.target.value })}
            placeholder="Sampling location"
          />
        </FormField>
      </div>

      <div className="grid-2">
        <FormField label="Latitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={envForm.latitude}
            onChange={(e) => setEnvForm({ ...envForm, latitude: e.target.value })}
            placeholder="e.g., 28.6139"
          />
        </FormField>
        <FormField label="Longitude" required>
          <input
            type="number"
            required
            step="0.0001"
            value={envForm.longitude}
            onChange={(e) => setEnvForm({ ...envForm, longitude: e.target.value })}
            placeholder="e.g., 77.2090"
          />
        </FormField>
      </div>

      <div className="grid-3">
        <FormField label="Temperature (°C)">
          <input
            type="number"
            step="0.1"
            value={envForm.temperature}
            onChange={(e) => setEnvForm({ ...envForm, temperature: e.target.value })}
            placeholder="Temperature"
          />
        </FormField>
        <FormField label="Humidity (%)">
          <input
            type="number"
            step="0.1"
            value={envForm.humidity}
            onChange={(e) => setEnvForm({ ...envForm, humidity: e.target.value })}
            placeholder="Humidity percentage"
          />
        </FormField>
        <FormField label="Air Quality Index">
          <input
            type="number"
            step="0.1"
            value={envForm.air_quality_index}
            onChange={(e) => setEnvForm({ ...envForm, air_quality_index: e.target.value })}
            placeholder="AQI value"
          />
        </FormField>
      </div>

      <div className="grid-2">
        <FormField label="Water pH">
          <input
            type="number"
            step="0.1"
            value={envForm.water_quality_ph}
            onChange={(e) => setEnvForm({ ...envForm, water_quality_ph: e.target.value })}
            placeholder="pH level"
          />
        </FormField>
        <FormField label="Water Turbidity">
          <input
            type="number"
            step="0.1"
            value={envForm.water_turbidity}
            onChange={(e) => setEnvForm({ ...envForm, water_turbidity: e.target.value })}
            placeholder="NTU"
          />
        </FormField>
      </div>

      <FormField label="Notes">
        <textarea
          value={envForm.notes}
          onChange={(e) => setEnvForm({ ...envForm, notes: e.target.value })}
          placeholder="Additional observations..."
          className="resize-none"
          rows="3"
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className={`button-primary w-full flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Send className="w-4 h-4" />
        {loading ? 'Submitting...' : 'Submit Environmental Report'}
      </button>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-emerald-500 border-opacity-20">
        <h2 className="text-3xl font-bold text-white mb-2">Data Submission Portal</h2>
        <p className="text-slate-400">Report surveillance data to the system</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 slide-in-up ${
            message.type === 'success'
              ? 'bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 text-emerald-100'
              : 'bg-red-500 bg-opacity-20 border-2 border-red-500 text-red-100'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          { id: 'human', label: 'Human Cases', icon: Users },
          { id: 'animal', label: 'Animal Events', icon: Wind },
          { id: 'environmental', label: 'Environmental', icon: Droplets },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === id
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <div className="card">
        {activeTab === 'human' && renderHumanForm()}
        {activeTab === 'animal' && renderAnimalForm()}
        {activeTab === 'environmental' && renderEnvForm()}
      </div>
    </div>
  );
};

export default DataSubmission;
