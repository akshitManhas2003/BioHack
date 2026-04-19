# Data Submission Portal - Example Datasets & Forms Guide

## 📋 Overview

This guide provides example datasets, form filling instructions, and sample submissions for the One Health Surveillance System's data submission portal.

---

## 🏥 HUMAN CASES DATA SUBMISSION

### Tab 1: Human Cases - Form Fields & Examples

#### **Basic Information**

| Field | Example 1 | Example 2 | Example 3 | Notes |
|-------|-----------|-----------|-----------|-------|
| **Patient Name** | John Kipchoge | Grace Nakamatte | Tadesse Bekele | Full name of patient |
| **Age** | 45 | 28 | 25 | Age in years |
| **Gender** | Male (M) | Female (F) | Male (M) | M/F |
| **Case Type** | Respiratory | Gastrointestinal | Respiratory | Select from dropdown |
| **Severity** | High | Moderate | Low | Low/Moderate/High/Critical |

#### **Symptoms (Select Multiple)**

**Example 1 - Respiratory High Severity:**
- ☑ Cough
- ☑ Fever
- ☑ Shortness of breath
- ☑ Headache
- ☐ Sore throat

**Example 2 - Gastrointestinal High Severity:**
- ☑ Diarrhea
- ☑ Vomiting
- ☑ Abdominal pain
- ☑ Dehydration
- ☐ Nausea

**Example 3 - Respiratory Low Severity:**
- ☑ Mild cough
- ☐ Fever
- ☐ Shortness of breath
- ☐ Headache
- ☐ Sore throat

#### **Location Information**

| Field | Example 1 | Example 2 | Example 3 |
|-------|-----------|-----------|-----------|
| **Location Name** | Nairobi, Eastlands | Kampala, Downtown | Addis Ababa, Bole |
| **Latitude** | -1.2921 | 0.3476 | 9.0320 |
| **Longitude** | 36.8219 | 32.5825 | 38.7469 |

**How to get coordinates:**
- Use Google Maps: Right-click location → Copy coordinates
- Use map interface: Click on map to set location
- Format: decimal degrees (e.g., -1.2921, 36.8219)

#### **Clinical Information**

| Field | Example 1 | Example 2 | Example 3 |
|-------|-----------|-----------|-----------|
| **Hospitalized** | ☑ Yes | ☐ No | ☐ No |
| **Contact Count** | 12 | 5 | 2 |
| **Current Outcome** | Recovering | Stable | Recovered |

#### **Submit Button**
- Green button: "Submit Case"
- On success: Confirmation message with Case ID (e.g., HUMAN_001)
- Alert banner at top indicates successful submission

---

### 📝 Step-by-Step Form Filling Examples

#### **EXAMPLE 1: Fill High-Severity Respiratory Case**

```
1. Patient Name: "John Kipchoge"
2. Age: 45
3. Gender: Male
4. Case Type: Respiratory
5. Symptoms: Check [Cough, Fever, Shortness of breath, Headache]
6. Severity: High
7. Hospitalized: Yes
8. Contact Count: 12
9. Current Outcome: Recovering
10. Location Name: "Nairobi, Eastlands"
11. Latitude: -1.2921
12. Longitude: 36.8219
13. Click "Submit Case"
```

✅ **Expected Result:** "Case submitted successfully. Case ID: HUMAN_001"

---

#### **EXAMPLE 2: Fill Foodborne Illness Case**

```
1. Patient Name: "Grace Nakamatte"
2. Age: 28
3. Gender: Female
4. Case Type: Gastrointestinal
5. Symptoms: Check [Diarrhea, Vomiting, Abdominal pain]
6. Severity: High
7. Hospitalized: Yes
8. Contact Count: 5
9. Current Outcome: Recovering
10. Location Name: "Kampala, Downtown"
11. Latitude: 0.3476
12. Longitude: 32.5825
13. Click "Submit Case"
```

✅ **Expected Result:** "Case submitted successfully. Case ID: HUMAN_004"

---

#### **EXAMPLE 3: Fill Mild Respiratory Case**

```
1. Patient Name: "Tadesse Bekele"
2. Age: 25
3. Gender: Male
4. Case Type: Respiratory
5. Symptoms: Check [Mild cough]
6. Severity: Low
7. Hospitalized: No
8. Contact Count: 2
9. Current Outcome: Recovering
10. Location Name: "Addis Ababa, Bole"
11. Latitude: 9.0320
12. Longitude: 38.7469
13. Click "Submit Case"
```

✅ **Expected Result:** "Case submitted successfully. Case ID: HUMAN_007"

---

## 🐾 ANIMAL EVENTS DATA SUBMISSION

### Tab 2: Animal Events - Form Fields & Examples

#### **Animal Information**

| Field | Example 1 | Example 2 | Example 3 | Notes |
|-------|-----------|-----------|-----------|-------|
| **Species** | Chicken | Turkey | Cattle | Poultry/Swine/Cattle/Sheep |
| **Population Count** | 500 | 200 | 150 | Total animals on farm |
| **Mortality Count** | 45 | 18 | 5 | Number dead |
| **Morbidity Count** | 120 | 55 | 28 | Number affected/sick |

#### **Clinical Signs (Select Multiple)**

**Example 1 - Poultry Respiratory:**
- ☑ Respiratory distress
- ☑ Dropped egg production
- ☑ Lethargy
- ☐ Diarrhea

**Example 2 - Poultry Mixed:**
- ☑ Coughing
- ☑ Nasal discharge
- ☑ Reduced appetite
- ☐ Diarrhea

**Example 3 - Cattle GI:**
- ☑ Diarrhea
- ☑ Reduced milk production
- ☐ Respiratory distress
- ☐ Lethargy

#### **Location & Farm Information**

| Field | Example 1 | Example 2 | Example 3 |
|-------|-----------|-----------|-----------|
| **Location Name** | Nairobi, Poultry Farm | Nairobi, Mixed Farm | Kampala, Dairy Farm |
| **Latitude** | -1.2915 | -1.2918 | 0.3480 |
| **Longitude** | 36.8225 | 36.8220 | 32.5820 |
| **Farm ID** | FARM_001 | FARM_002 | FARM_003 |
| **Vaccination Status** | Partially Vaccinated | Not Vaccinated | Fully Vaccinated |

#### **Mortality Rate Calculation**

```
Mortality Rate = (Mortality Count / Population Count) × 100

Example 1: (45 / 500) × 100 = 9% mortality (HIGH ALERT)
Example 2: (18 / 200) × 100 = 9% mortality (HIGH ALERT)
Example 3: (5 / 150) × 100 = 3.3% mortality (MODERATE)
```

---

### 📝 Step-by-Step Form Filling Examples

#### **EXAMPLE 1: Poultry Farm Outbreak**

```
1. Species: Chicken
2. Population Count: 500
3. Mortality Count: 45 ⚠️ (9% mortality)
4. Morbidity Count: 120
5. Clinical Signs: Check [Respiratory distress, Dropped egg production, Lethargy]
6. Location Name: "Nairobi, Poultry Farm"
7. Latitude: -1.2915
8. Longitude: 36.8225
9. Farm ID: "FARM_001"
10. Vaccination Status: Partially Vaccinated
11. Click "Submit Event"
```

✅ **Expected Result:** "Event submitted successfully. Event ID: ANIMAL_001"  
🚨 **Note:** High mortality may trigger automatic alerts

---

#### **EXAMPLE 2: Mixed Farm Disease Event**

```
1. Species: Turkey
2. Population Count: 200
3. Mortality Count: 18 ⚠️ (9% mortality)
4. Morbidity Count: 55
5. Clinical Signs: Check [Coughing, Nasal discharge, Reduced appetite]
6. Location Name: "Nairobi, Mixed Farm"
7. Latitude: -1.2918
8. Longitude: 36.8220
9. Farm ID: "FARM_002"
10. Vaccination Status: Not Vaccinated ⚠️
11. Click "Submit Event"
```

✅ **Expected Result:** "Event submitted successfully. Event ID: ANIMAL_002"  
🚨 **Alert:** Unvaccinated animals + high mortality → CRITICAL ALERT

---

#### **EXAMPLE 3: Dairy Farm with Low Mortality**

```
1. Species: Cattle
2. Population Count: 150
3. Mortality Count: 5 ✓ (3.3% mortality)
4. Morbidity Count: 28
5. Clinical Signs: Check [Diarrhea, Reduced milk production]
6. Location Name: "Kampala, Dairy Farm"
7. Latitude: 0.3480
8. Longitude: 32.5820
9. Farm ID: "FARM_003"
10. Vaccination Status: Fully Vaccinated ✓
11. Click "Submit Event"
```

✅ **Expected Result:** "Event submitted successfully. Event ID: ANIMAL_003"  
✓ **Note:** Vaccinated + low mortality = manageable situation

---

## 🌍 ENVIRONMENTAL SAMPLES DATA SUBMISSION

### Tab 3: Environmental Samples - Form Fields & Examples

#### **Sample Information**

| Field | Example 1 | Example 2 | Example 3 | Example 4 | Notes |
|-------|-----------|-----------|-----------|-----------|-------|
| **Sample Type** | Water | Food | Air | Soil | Select from dropdown |
| **Location Name** | Nairobi Market | Kampala Market | Lagos Industrial | Lagos Agricultural | Description |
| **Latitude** | -1.2925 | 0.3478 | 6.5244 | 6.5240 | Decimal degrees |
| **Longitude** | 36.8215 | 32.5825 | 3.3792 | 3.3795 | Decimal degrees |

#### **Water Sample Parameters (if Water selected)**

| Parameter | Normal Range | Example 1 | Alert Level |
|-----------|--------------|-----------|------------|
| **pH** | 6.5 - 8.5 | 6.8 | Normal |
| **Turbidity** | < 5 NTU | 8.5 | High ⚠️ |
| **Temperature** | 15 - 25°C | 22°C | Normal |

#### **Air Quality Parameters (if Air selected)**

| Parameter | Normal Range | Example 1 | Alert Level |
|-----------|--------------|-----------|------------|
| **Air Quality Index** | < 50 | 156 | Critical 🚨 |
| **Pollutant Level** | < 50 µg/m³ | 289 | Critical 🚨 |
| **Pollutant Type** | - | PM10 | - |
| **Temperature** | - | 31°C | - |

#### **Soil Sample Parameters (if Soil selected)**

| Parameter | Normal Range | Example 1 | Alert Level |
|-----------|--------------|-----------|------------|
| **pH** | 6.0 - 7.5 | 5.2 | Acidic ⚠️ |
| **Heavy Metals** | Low | High | High ⚠️ |

#### **Food Sample Parameters (if Food selected)**

| Parameter | Normal Range | Example 1 | Alert Level |
|-----------|--------------|-----------|------------|
| **Temperature** | < 15°C (stored) | 28°C | Warm ⚠️ |
| **Humidity** | < 60% | 75% | High ⚠️ |
| **Contamination** | None detected | Salmonella | High 🚨 |

#### **Pathogen Detection (All Types)**

| Example | Pathogens Detected | Risk Level |
|---------|-------------------|-----------|
| Water sample | H5N1, Influenza A | CRITICAL 🚨 |
| Food sample | Salmonella, E.coli O157:H7 | HIGH ⚠️ |
| Air sample | None | LOW ✓ |
| Soil sample | Mycobacterium, Coccidioides | HIGH ⚠️ |

#### **Pollutant Level Scale**

```
0-2:    ✓ Low (Green)
2-5:    ⚠️ Moderate (Yellow)
5-8:    ⚠️ High (Orange)
8-10:   🚨 Critical (Red)
```

---

### 📝 Step-by-Step Form Filling Examples

#### **EXAMPLE 1: Contaminated Water Sample**

```
1. Sample Type: Water
2. Location Name: "Nairobi, Market Water Source"
3. Latitude: -1.2925
4. Longitude: -36.8215
5. pH: 6.8 ✓
6. Turbidity: 8.5 ⚠️ (HIGH - above 5 NTU limit)
7. Temperature: 22°C ✓
8. Pathogen Detected: [Check] H5N1, [Check] Influenza A 🚨
9. Pollutant Level: 8.5 (Critical)
10. Pollutant Type: "Biological"
11. Notes: "Water source near poultry market showing high contamination"
12. Click "Submit Sample"
```

✅ **Expected Result:** "Sample submitted successfully. Sample ID: ENV_001"  
🚨 **Alert:** Pathogens detected → CRITICAL ALERT generated  
🔗 **Linked:** If human respiratory cases nearby → Zoonotic Risk Alert

---

#### **EXAMPLE 2: Food Contamination Sample**

```
1. Sample Type: Food
2. Location Name: "Kampala, Market Produce"
3. Latitude: 0.3478
4. Longitude: 32.5825
5. Temperature: 28°C ⚠️ (Too warm for vegetable storage)
6. Humidity: 75% ⚠️ (Too high for fresh produce)
7. Pathogen Detected: [Check] Salmonella, [Check] E.coli O157:H7 🚨
8. Pollutant Level: 7.8 (High)
9. Pollutant Type: "Biological"
10. Notes: "Vegetables from local market testing positive for pathogens"
11. Click "Submit Sample"
```

✅ **Expected Result:** "Sample submitted successfully. Sample ID: ENV_002"  
🚨 **Alert:** GI pathogens in food + nearby human GI cases → FOODBORNE ALERT  
🔗 **Public Health Action:** Market inspection recommended

---

#### **EXAMPLE 3: Poor Air Quality Sample**

```
1. Sample Type: Air
2. Location Name: "Lagos, Industrial Area"
3. Latitude: 6.5244
4. Longitude: 3.3792
5. Air Quality Index: 156 🚨 (Critical - WHO limit: 50)
6. Pollutant Level: 289 µg/m³ 🚨 (PM10 - WHO limit: 50)
7. Pollutant Type: "PM10"
8. Temperature: 31°C
9. Pathogen Detected: None
10. Notes: "Severe air pollution from industrial emissions"
11. Click "Submit Sample"
```

✅ **Expected Result:** "Sample submitted successfully. Sample ID: ENV_003"  
⚠️ **Alert:** MODERATE Environmental Hazard  
📋 **Action:** Respiratory health monitoring recommended

---

#### **EXAMPLE 4: Contaminated Soil Sample**

```
1. Sample Type: Soil
2. Location Name: "Lagos, Nearby Agricultural Area"
3. Latitude: 6.5240
4. Longitude: 3.3795
5. pH: 5.2 ⚠️ (Acidic - normal 6-7.5)
6. Heavy Metals: High ⚠️
7. Pathogen Detected: [Check] Mycobacterium, [Check] Coccidioides ⚠️
8. Pollutant Level: 8.9 (Critical)
9. Pollutant Type: "Heavy Metals"
10. Temperature: 29°C
11. Notes: "Soil contamination affecting local crops"
12. Click "Submit Sample"
```

✅ **Expected Result:** "Sample submitted successfully. Sample ID: ENV_004"  
⚠️ **Alert:** Environmental Hazard - Agriculture at risk  
📋 **Action:** Agricultural extension guidance needed

---

## 📊 API Submission Examples

### POST Requests for Direct API Access

#### **Submit Human Case (cURL)**

```bash
curl -X POST http://localhost:8000/api/human/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Kipchoge",
    "age": 45,
    "gender": "M",
    "case_type": "Respiratory",
    "symptoms": ["cough", "fever", "shortness_of_breath"],
    "severity": "High",
    "hospitalized": true,
    "contact_count": 12,
    "outcome": "Recovering",
    "location_name": "Nairobi, Eastlands",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "reported_by": "doctor_ali"
  }'
```

---

#### **Submit Animal Event (cURL)**

```bash
curl -X POST http://localhost:8000/api/animal/reports \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Chicken",
    "population_count": 500,
    "mortality_count": 45,
    "morbidity_count": 120,
    "clinical_signs": ["respiratory_distress", "lethargy"],
    "location_name": "Nairobi, Poultry Farm",
    "latitude": -1.2915,
    "longitude": 36.8225,
    "farm_id": "FARM_001",
    "vaccination_status": "Partially Vaccinated",
    "reported_by": "vet_fatima"
  }'
```

---

#### **Submit Environmental Sample (cURL)**

```bash
curl -X POST http://localhost:8000/api/environmental/reports \
  -H "Content-Type: application/json" \
  -d '{
    "sample_type": "Water",
    "location_name": "Nairobi, Market Water Source",
    "latitude": -1.2925,
    "longitude": 36.8215,
    "water_quality_ph": 6.8,
    "water_turbidity": 8.5,
    "temperature": 22,
    "pathogen_detected": ["H5N1", "Influenza A"],
    "pollutant_level": 8.5,
    "pollutant_type": "Biological",
    "notes": "Water source near poultry market showing high contamination",
    "reported_by": "env_ahmed"
  }'
```

---

## 🎯 Form Validation Rules

### Human Cases

| Field | Min | Max | Format | Required |
|-------|-----|-----|--------|----------|
| Patient Name | 2 | 255 | Text | Yes |
| Age | 0 | 150 | Number | Yes |
| Gender | - | - | M/F | Yes |
| Case Type | - | - | Dropdown | Yes |
| Severity | - | - | Dropdown | Yes |
| Latitude | -90 | 90 | Decimal | Yes |
| Longitude | -180 | 180 | Decimal | Yes |
| Contact Count | 0 | 1000 | Number | Yes |

### Animal Events

| Field | Min | Max | Format | Required |
|-------|-----|-----|--------|----------|
| Species | - | - | Dropdown | Yes |
| Population Count | 1 | 1,000,000 | Number | Yes |
| Mortality Count | 0 | Population | Number | Yes |
| Morbidity Count | 0 | Population | Number | Yes |
| Latitude | -90 | 90 | Decimal | Yes |
| Longitude | -180 | 180 | Decimal | Yes |
| Farm ID | 2 | 50 | Alphanumeric | No |
| Vaccination Status | - | - | Dropdown | No |

### Environmental Samples

| Field | Min | Max | Format | Required |
|-------|-----|-----|--------|----------|
| Sample Type | - | - | Dropdown | Yes |
| Latitude | -90 | 90 | Decimal | Yes |
| Longitude | -180 | 180 | Decimal | Yes |
| Temperature | -50 | 60 | Decimal (°C) | No |
| pH | 0 | 14 | Decimal | No |
| Pollutant Level | 0 | 10 | Decimal | No |
| Pathogen Count | 0 | 10 | Number | No |

---

## 🔄 Submission Workflow Example

### Complete Workflow: Detect and Report an Outbreak

**Day 1 - Morning (08:00)**
1. ✅ Health worker submits 1st respiratory case
   - Patient: John Kipchoge, High severity
   - Location: Nairobi, Eastlands
   - **System Status:** 1 case, No alert yet

**Day 1 - Afternoon (14:00)**
2. ✅ Veterinarian submits animal event
   - Poultry farm: 45 chicken deaths
   - Location: 2.1km from first case
   - **System Status:** 1 human + 1 animal, No alert yet

**Day 1 - Evening (18:00)**
3. ✅ Environmental monitor submits water sample
   - Location: Between human case and poultry farm
   - Pathogens: H5N1 detected
   - **System Status:** 🚨 **CRITICAL ALERT GENERATED**
   - Alert Type: Zoonotic Risk
   - Risk Score: 92/100

**Day 2 - Morning (09:00)**
4. ✅ Health worker submits 2nd respiratory case
   - Patient: Mary Wanjiru, Moderate severity
   - Location: 200m from first case
   - **System Status:** 🚨 Alert escalated (2 cases + zoonotic)

**Day 2 - Afternoon (15:00)**
5. ✅ Veterinarian submits 2nd animal event
   - Turkey farm: 18 deaths
   - Location: 300m from chicken farm
   - **System Status:** 🚨 Alert escalated (spatial + species clustering)

---

## 📱 Mobile-Friendly Submission Tips

When submitting on mobile devices:

1. **Use the map interface** to set coordinates (easier than typing)
2. **Select from dropdowns** rather than typing free text
3. **Use checkboxes** for multiple symptoms/signs
4. **Photos/evidence** can be attached (optional)
5. **Auto-save drafts** to prevent data loss
6. **Offline mode** stores submissions temporarily

---

## 🏆 Best Practices for Data Entry

### ✅ DO:
- Enter data as soon as possible (real-time is better)
- Use consistent location names
- Double-check coordinates (use map)
- Include all relevant symptoms/signs
- Note any unusual circumstances
- Update outcomes when available

### ❌ DON'T:
- Delay submission while waiting for perfect data
- Mix different units (always use°C, decimal degrees)
- Leave required fields blank
- Enter approximate coordinates if actual available
- Submit duplicate entries
- Modify historical data

---

## 🔗 Cross-Domain Linking

When submitting data, note these automatic linkages:

```
Human Case 
    + Animal Event (within 10km, 48 hours)
    + Environmental Sample (pathogen match)
    → ZOONOTIC ALERT

Human Cases (2+ within 2km, 7 days)
    + Food/Water Contamination
    → FOODBORNE ALERT

Environmental Sample
    + Poor Quality Indicators
    → ENVIRONMENTAL HAZARD ALERT
```

---

## 📞 Support & Questions

- **Form validation errors?** Check field ranges above
- **Coordinates not working?** Use map click interface
- **Data not appearing?** Check network connection, try refresh
- **API integration?** See [API_REFERENCE.md](../API_REFERENCE.md)

---

**Last Updated:** April 19, 2026  
**Version:** 1.0.0  
**Status:** Ready for Demonstration
