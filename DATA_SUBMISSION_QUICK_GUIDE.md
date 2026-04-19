# Data Submission Portal - Quick Reference Guide

## 🚀 Quick Start

### Accessing the Portal
1. Open browser: http://localhost:3000
2. Click **"Data Submission"** in navigation bar
3. Select a tab: **Human Cases**, **Animal Events**, or **Environmental Samples**

---

## 📝 Form Overview

The data submission portal has **3 main tabs**:

### Tab 1: Human Cases
**Purpose:** Report suspected human disease cases  
**Fields:** Patient info, symptoms, location, contact tracing  
**When to use:** Healthcare facilities, clinics, general practitioners

### Tab 2: Animal Events  
**Purpose:** Report animal mortality, morbidity events  
**Fields:** Species, population, mortality rate, farm info  
**When to use:** Veterinarians, farmers, animal health workers

### Tab 3: Environmental Samples
**Purpose:** Report environmental hazards and contamination  
**Fields:** Sample type, quality parameters, pathogen detection  
**When to use:** Lab technicians, environmental health officers

---

## 🎯 How to Submit Data

### Step 1: Navigate to Form
```
Frontend → Data Submission → Select Tab
```

### Step 2: Fill Required Fields
- Required fields marked with * (asterisk)
- Validation happens automatically
- Form prevents submission if data is invalid

### Step 3: Enter Location
**Two ways to set location:**

**Method A - Manual Entry:**
- Enter Latitude (decimal: -90 to 90)
- Enter Longitude (decimal: -180 to 180)

**Method B - Map Click:**
- Click on map interface
- Location auto-fills

**Finding Coordinates:**
- Google Maps: Right-click → Copy coordinates
- Example format: `-1.2921, 36.8219`

### Step 4: Submit
- Click **"Submit Case"** / **"Submit Event"** / **"Submit Sample"**
- Wait for confirmation message
- Record the ID for reference

### Step 5: View Confirmation
✅ Green banner: "Successfully submitted! ID: HUMAN_001"  
or  
❌ Red banner: Shows validation error

---

## 📋 Form Field Reference

### Human Cases Form

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Patient Name | Text | Yes | John Kipchoge | Full name |
| Age | Number | Yes | 45 | 0-150 years |
| Gender | Select | Yes | Male/Female | M or F |
| Case Type | Select | Yes | Respiratory | Drop-down list |
| Severity | Select | Yes | High | Low/Moderate/High/Critical |
| Symptoms | Checkbox | Yes | Cough, Fever | Select multiple |
| Hospitalized | Yes/No | Yes | Yes | Toggle switch |
| Contact Count | Number | Yes | 12 | 0-1000 |
| Current Outcome | Select | Yes | Recovering | Stable/Recovering/Recovered |
| Location Name | Text | Yes | Nairobi, Eastlands | City, District |
| Latitude | Decimal | Yes | -1.2921 | -90 to 90 |
| Longitude | Decimal | Yes | 36.8219 | -180 to 180 |

### Animal Events Form

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Species | Select | Yes | Chicken | Poultry/Swine/Cattle/Sheep |
| Population Count | Number | Yes | 500 | 1-1,000,000 |
| Mortality Count | Number | Yes | 45 | 0 to Population |
| Morbidity Count | Number | Yes | 120 | 0 to Population |
| Clinical Signs | Checkbox | Yes | Lethargy | Select multiple |
| Location Name | Text | Yes | Farm Name | Description |
| Latitude | Decimal | Yes | -1.2915 | -90 to 90 |
| Longitude | Decimal | Yes | 36.8225 | -180 to 180 |
| Farm ID | Text | No | FARM_001 | Identifier |
| Vaccination Status | Select | No | Fully Vaccinated | Yes/No/Partial |

### Environmental Samples Form

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| Sample Type | Select | Yes | Water | Water/Food/Air/Soil |
| Location Name | Text | Yes | Market | Description |
| Latitude | Decimal | Yes | -1.2925 | -90 to 90 |
| Longitude | Decimal | Yes | 36.8215 | -180 to 180 |
| Temperature | Decimal | No | 22 | In °C |
| pH | Decimal | No | 6.8 | 0-14 |
| Pathogens | Checkbox | No | H5N1 | Multiple selection |
| Pollutant Level | Number | No | 8.5 | 0-10 scale |
| Notes | Text | No | Details... | Additional info |

---

## ✅ Validation Rules

### General Rules
- ✓ All required fields must be filled
- ✓ Latitude must be between -90 and 90
- ✓ Longitude must be between -180 and 180
- ✓ Names must be 2+ characters
- ✓ Ages must be 0-150
- ✓ At least one symptom/sign must be selected

### Numeric Constraints
- Population counts: 1 to 1,000,000
- Contact count: 0 to 1,000
- Mortality ≤ Population
- Morbidity ≤ Population
- Pollutant level: 0 to 10

### Location Validation
```
Valid:   -1.2921, 36.8219  (Nairobi)
Valid:   0.3476, 32.5825   (Kampala)
Invalid: 95.5, 50.5        (Latitude out of range)
Invalid: -1.2921           (Longitude missing)
```

---

## 🗺️ Map Integration

### Map Features
- **Click to set location:** Automatically fills coordinates
- **Real-time plotting:** See cases as you submit them
- **Zoom/Pan:** Navigate to your area of interest
- **Location markers:** Different colors for case types
  - 🔴 Human cases: Red
  - 🟡 Animal events: Yellow
  - 🟢 Environmental: Green

### Using the Map
```
1. Click on form location field (if available)
2. Click on map at desired location
3. Coordinates auto-populate
4. Continue filling form
5. Submit
```

---

## 🚨 Alert System

### Automatic Alerts Triggered By:

**CRITICAL Alerts 🚨**
- High-severity respiratory + animal deaths + environmental pathogen
- Unvaccinated animals with high mortality (>8%)
- Multiple human cases in same location within 48 hours

**HIGH Alerts ⚠️**
- Confirmed pathogen in food/water + human GI cases
- Animal deaths > 5% in unvaccinated population
- Environmental pollution critical levels

**MODERATE Alerts ⚠️**
- Single high-severity case far from others
- Environmental contamination without immediate risk
- Animal illness with low mortality

**LOW Alerts ℹ️**
- Routine surveillance data
- Single low-severity case
- Normal environmental readings

---

## 📱 Mobile Submission

### Best Practices
1. **Use map interface** for coordinates (easier than typing)
2. **Pre-select checkboxes** for symptoms before submitting
3. **Check internet connection** before submitting
4. **Keep forms short** - submit multiple times if needed
5. **Use landscape mode** for better form layout

---

## 🔄 Common Workflows

### Workflow 1: Report Single Case
```
1. Click Human Cases tab
2. Enter patient details
3. Click map to set location
4. Select symptoms (check all applicable)
5. Click "Submit Case"
✅ Case recorded, ID assigned
```

### Workflow 2: Report Farm Outbreak
```
1. Click Animal Events tab
2. Enter species and numbers
3. Click map to set farm location
4. Select clinical signs
5. Enter farm ID (optional)
6. Click "Submit Event"
✅ Event recorded, ID assigned
```

### Workflow 3: Report Environmental Issue
```
1. Click Environmental Samples tab
2. Select sample type (Water/Food/Air/Soil)
3. Enter location name
4. Click map to set coordinates
5. Fill quality parameters (if applicable)
6. Select pathogens (if applicable)
7. Click "Submit Sample"
✅ Sample recorded, ID assigned
```

### Workflow 4: Detect & Investigate Outbreak
```
Day 1 (Morning):  Submit human case → No alert
Day 1 (Afternoon): Submit animal event (nearby) → No alert
Day 1 (Evening):  Submit environmental sample (positive) → CRITICAL ALERT
Day 2 (Morning):  Submit 2nd human case → Alert escalated
Day 2 (Noon):     Submit 2nd animal event → Outbreak confirmed
🚨 System identifies zoonotic outbreak, notifies public health
```

---

## 🧪 Testing the Portal

### Test Scenario 1: Basic Submission
```bash
# From backend directory:
python test_submissions.py
```
This submits 11 pre-configured examples across all 3 tabs.

### Test Scenario 2: Manual Testing
1. Submit a human case manually
2. Verify it appears on Dashboard
3. Verify it appears on Map
4. Query API: http://localhost:8000/docs

### Test Scenario 3: Validation Testing
Try submitting with:
- Missing required fields → See error message
- Invalid coordinates → See validation error
- Mortality > Population → See validation error

---

## 📊 Data You'll See

After submitting test data, expect to see:

**Dashboard:**
- Total cases: 8
- Total events: 4
- Total samples: 4
- Critical alerts: 1
- High alerts: 1
- Moderate alerts: 1
- Low alerts: 1

**Map:**
- 8 human case markers
- 4 animal event markers
- 4 environmental markers
- 4 alert zones highlighted

**Alerts:**
- CRITICAL: Nairobi respiratory + poultry outbreak
- HIGH: Kampala foodborne cluster
- MODERATE: Lagos environmental hazard
- LOW: Addis Ababa routine surveillance

---

## 🔗 API Reference

Submit data programmatically:

### Submit Human Case
```bash
curl -X POST http://localhost:8000/api/human/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Doe",
    "age": 35,
    "gender": "M",
    "case_type": "Respiratory",
    "severity": "High",
    ...
  }'
```

### Query Submitted Data
```bash
# Get all human cases
curl http://localhost:8000/api/human/reports

# Get all alerts
curl http://localhost:8000/api/alerts

# Get all environmental samples
curl http://localhost:8000/api/environmental/reports
```

---

## ❓ Troubleshooting

### Issue: Form won't submit
**Solution:** Check validation messages below form fields for errors

### Issue: Location not appearing on map
**Solution:** Verify latitude (-90 to 90) and longitude (-180 to 180) ranges

### Issue: Coordinates not auto-filling from map
**Solution:** Try scrolling to location field and clicking again

### Issue: Submit button greyed out
**Solution:** Fill all required fields (marked with *)

### Issue: API connection error
**Solution:** Verify backend is running: `uvicorn main:app --reload`

### Issue: Data not appearing on dashboard
**Solution:** Refresh page with F5 or Ctrl+R

---

## 📞 Support

**Having issues?** Check:
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common solutions
2. [API_REFERENCE.md](API_REFERENCE.md) - API documentation
3. Backend logs: Check terminal where `uvicorn` is running
4. Browser console: F12 → Console tab for JavaScript errors

---

## 🎓 Learning Path

**New to the system?**
1. Read this guide (5 min)
2. Run test_submissions.py (auto-submits 11 examples)
3. View Dashboard to see results
4. Try submitting your own case
5. Check API documentation for advanced usage

---

**Last Updated:** April 19, 2026  
**Status:** Production Ready  
**Version:** 1.0.0
