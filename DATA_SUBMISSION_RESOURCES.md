# Data Submission Portal - Complete Resource Index

## 📚 Documentation Files

### For Users (Portal Users & Data Entry Personnel)

#### 1. **[DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md)** ⭐ START HERE
- **Purpose:** Quick reference for using the data submission portal
- **Content:** Form fields, validation rules, workflows, troubleshooting
- **Best for:** Healthcare workers, veterinarians, lab technicians
- **Read time:** 10 minutes
- **What you'll learn:**
  - How to access the portal
  - How to fill each form correctly
  - Navigation tips
  - Common workflows
  - Testing procedures

#### 2. **[DATA_SUBMISSION_GUIDE.md](DATA_SUBMISSION_GUIDE.md)** 📋 COMPREHENSIVE GUIDE
- **Purpose:** Detailed guide with example datasets and use cases
- **Content:** Complete example data, API examples, submission workflows
- **Best for:** System administrators, data analysts, developers
- **Read time:** 20-30 minutes
- **What you'll learn:**
  - 4 realistic use case scenarios
  - 11 detailed example submissions
  - API submission examples (cURL)
  - Cross-domain linking logic
  - Best practices for data entry

#### 3. **[EXAMPLE_DATASETS.json](EXAMPLE_DATASETS.json)** 📊 STRUCTURED DATA
- **Purpose:** Machine-readable example data in JSON format
- **Content:** 11 complete submission examples, 3 scenarios, testing checklist
- **Best for:** Developers, API testing, integration testing
- **Format:** JSON with full example data
- **What you'll find:**
  - 4 human case examples
  - 4 animal event examples
  - 4 environmental sample examples
  - 3 complete submission scenarios
  - System testing checklist

---

### For Developers & Technical Staff

#### 4. **[backend/test_submissions.py](backend/test_submissions.py)** 🧪 TEST SCRIPT
- **Purpose:** Automated testing of data submission endpoints
- **Usage:** `python test_submissions.py`
- **What it does:**
  - Checks API connectivity
  - Submits 11 example records
  - Validates responses
  - Prints summary report
- **Features:**
  - Command-line arguments
  - Error reporting
  - Connection testing
  - Result logging

---

## 🎯 Quick Navigation by Role

### I'm a... 👥

#### **Healthcare Worker** 🏥
1. Read: [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md)
2. Go to: http://localhost:3000 → Data Submission → Human Cases
3. Reference: [Example human cases](DATA_SUBMISSION_GUIDE.md#human-cases-data-submission)
4. Submit: Fill form, click map, submit

#### **Veterinarian** 🐾
1. Read: [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md)
2. Go to: http://localhost:3000 → Data Submission → Animal Events
3. Reference: [Example animal events](DATA_SUBMISSION_GUIDE.md#animal-events-data-submission)
4. Submit: Species, population, mortality, farm location

#### **Environmental Health Officer** 🌍
1. Read: [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md)
2. Go to: http://localhost:3000 → Data Submission → Environmental Samples
3. Reference: [Example environmental samples](DATA_SUBMISSION_GUIDE.md#environmental-samples-data-submission)
4. Submit: Sample type, location, parameters, pathogens

#### **System Administrator** 👨‍💼
1. Read: [DATA_SUBMISSION_GUIDE.md](DATA_SUBMISSION_GUIDE.md) (full)
2. Test: `python backend/test_submissions.py`
3. Verify: Check Dashboard and Alerts
4. Validate: Check logs for any errors

#### **Developer** 👨‍💻
1. Read: [API_REFERENCE.md](API_REFERENCE.md) for endpoint specs
2. Study: [EXAMPLE_DATASETS.json](EXAMPLE_DATASETS.json) for structure
3. Code: Use `requests` library to POST to endpoints
4. Test: Run `backend/test_submissions.py` for reference implementation

---

## 📊 Example Data Overview

### Human Cases (11 total across all docs)
- **4 detailed examples** in guides
- **Age range:** 25-45 years
- **Case types:** Respiratory, Gastrointestinal
- **Severity:** Low to High
- **Locations:** Nairobi, Kampala, Addis Ababa, Lagos
- **Risk levels:** Low to CRITICAL

### Animal Events (11 total across all docs)
- **4 detailed examples** in guides
- **Species:** Chicken, Turkey, Cattle, Swine
- **Mortality rates:** 3.3% to 9%
- **Locations:** Nairobi (multiple farms), Kampala, Lagos
- **Farm sizes:** 150 to 500 animals

### Environmental Samples (12 total across all docs)
- **4 detailed examples** in guides
- **Types:** Water, Food, Air, Soil
- **Quality:** Normal to Critical pollution levels
- **Pathogens:** H5N1, Influenza A, Salmonella, E.coli O157:H7, etc.
- **Risk indicators:** Multiple contamination types

### Complete Scenarios
1. **Zoonotic Outbreak** (Nairobi) → CRITICAL Alert
2. **Foodborne Cluster** (Kampala) → HIGH Alert
3. **Environmental Hazard** (Lagos) → MODERATE Alert
4. **Routine Surveillance** (Addis Ababa) → LOW Alert

---

## 🚀 Getting Started Checklist

- [ ] **Read** [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md) (10 min)
- [ ] **Verify** Backend running: `uvicorn main:app --reload`
- [ ] **Verify** Frontend running: `npm run dev`
- [ ] **Access** http://localhost:3000
- [ ] **Navigate** to Data Submission portal
- [ ] **Test** One example submission manually
- [ ] **View** Results in Dashboard
- [ ] **Optional** Run `python test_submissions.py` for bulk test
- [ ] **Reference** [EXAMPLE_DATASETS.json](EXAMPLE_DATASETS.json) as needed

---

## 📝 Data Submission Portal Features

### Forms (3 Tabs)

#### 1️⃣ Human Cases Tab
- Patient demographics
- Symptom selection (checkbox)
- Case severity classification
- Hospitalization tracking
- Contact tracing
- Real-time geolocation
- Outcome tracking

#### 2️⃣ Animal Events Tab
- Species selection
- Population statistics
- Mortality/morbidity calculation
- Clinical signs checklist
- Farm identification
- Vaccination status
- Veterinary assessment

#### 3️⃣ Environmental Samples Tab
- Sample type selection
- Quality parameters
- Pathogen detection
- Pollutant levels
- Temperature/pH/Humidity
- Location mapping
- Risk assessment

---

## 🔄 Data Flow

```
User Submits Form (Portal)
    ↓
Frontend Validates Data
    ↓
POST to API Endpoint
    ↓
Backend Validates Data
    ↓
Stores in SQLite Database
    ↓
Alert Generator Triggered
    ↓
System generates alerts based on rules
    ↓
Dashboard & Map Updated
    ↓
User sees real-time results
```

---

## 🧪 Testing Workflows

### Workflow A: Manual Testing (5 min)
1. Navigate to http://localhost:3000/data-submission
2. Select Human Cases tab
3. Fill one example case manually
4. Click map to set location
5. Submit
6. Verify on Dashboard

### Workflow B: Automated Testing (2 min)
1. Open terminal in `backend/` directory
2. Run: `python test_submissions.py`
3. Wait for completion message
4. Check Dashboard (refresh page)
5. Verify all 11 records appear

### Workflow C: Scenario Testing (10 min)
1. Follow [SCENARIO_001_ZOONOTIC](EXAMPLE_DATASETS.json#scenario_001_zoonotic) sequence
2. Submit 4 entries in order (human → animal → environmental → human)
3. Watch alerts escalate in real-time
4. Verify CRITICAL alert generated

### Workflow D: Validation Testing (5 min)
1. Try submitting with missing fields
2. Try invalid coordinates (>90 latitude)
3. Try mortality > population
4. Verify error messages display
5. Correct and resubmit

---

## 📱 Mobile & Web Access

### Desktop (Full Features)
- **URL:** http://localhost:3000
- **Browser:** Chrome, Firefox, Safari, Edge
- **Features:** All forms, map, dashboard, real-time updates

### Mobile (Responsive)
- **URL:** Same as desktop
- **Features:** Optimized touch interface, map for coordinates
- **Note:** Landscape mode recommended for forms

---

## 🔗 Related Documents

### System Documentation
- [README.md](README.md) - Project overview
- [API_REFERENCE.md](API_REFERENCE.md) - Complete API documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

### Project Documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [UI_UX_IMPROVEMENTS.md](UI_UX_IMPROVEMENTS.md) - Design system

### Database & Seed Data
- [DATASET_DOCUMENTATION.md](DATASET_DOCUMENTATION.md) - Initial seed data documentation
- `backend/seed_data.py` - Script that created initial 20 records
- `backend/one_health_surveillance.db` - SQLite database file

---

## 💡 Tips & Best Practices

### Form Entry
✅ Use map interface for coordinates (easier than typing)  
✅ Select all applicable symptoms/signs with checkboxes  
✅ Enter patient/farm names consistently  
✅ Record outcome information later  
✅ Note unusual circumstances in notes field  

### Data Quality
✅ Verify coordinates are within valid ranges  
✅ Cross-check mortality doesn't exceed population  
✅ Use consistent location naming  
✅ Include all relevant clinical signs  
✅ Document any special circumstances  

### Troubleshooting
❌ Form won't submit? Check for validation errors in red text  
❌ Coordinates not working? Verify lat/long ranges  
❌ Data not appearing? Refresh with F5  
❌ API error? Ensure backend is running  

---

## 📞 Support Resources

**Quick Answers:**
- See [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md#troubleshooting)

**Detailed Examples:**
- See [DATA_SUBMISSION_GUIDE.md](DATA_SUBMISSION_GUIDE.md)

**System Issues:**
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**API Details:**
- See [API_REFERENCE.md](API_REFERENCE.md)

**Architecture Questions:**
- See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 📊 Statistics

### Example Data Provided
- **Total Records:** 35+ examples across documentation
- **Human Cases:** 11 examples with different severities
- **Animal Events:** 11 examples with mortality/morbidity data
- **Environmental Samples:** 12 examples with quality parameters
- **Complete Scenarios:** 4 end-to-end outbreak workflows
- **API Examples:** 3 complete cURL requests

### Documentation Coverage
- **User Guides:** 2 comprehensive documents
- **API Reference:** Complete endpoint documentation
- **Example Data:** 3 formats (Markdown, JSON, Python)
- **Testing Scripts:** 1 automated test harness
- **Quick Reference:** 1 quick-start guide

---

## ✅ Verification Checklist

After setting up data submission, verify:

- [ ] Portal accessible at http://localhost:3000
- [ ] Data Submission tab visible
- [ ] All 3 tabs present (Human, Animal, Environmental)
- [ ] Forms accept text input
- [ ] Map interface clickable
- [ ] Checkboxes functional
- [ ] Submit button enabled when form valid
- [ ] Confirmation messages display
- [ ] Data appears on Dashboard
- [ ] Data visible on Map
- [ ] Alerts generated for high-severity cases

---

## 🎓 Learning Outcomes

After completing these resources, you'll understand:

1. How to use the data submission portal
2. What data to collect for each case type
3. How to map geographic locations
4. How the system generates alerts
5. How to access API endpoints
6. How to test the system
7. How data flows through the system
8. How to troubleshoot issues

---

**Last Updated:** April 19, 2026  
**Version:** 1.0.0  
**Status:** Complete & Ready for Use

---

## 🔍 Document Map

```
📦 ONE HEALTH SURVEILLANCE - DATA SUBMISSION RESOURCES
│
├── 📖 USER GUIDES
│   ├── DATA_SUBMISSION_QUICK_GUIDE.md ⭐ START HERE
│   └── DATA_SUBMISSION_GUIDE.md (Comprehensive)
│
├── 📊 EXAMPLE DATA
│   ├── EXAMPLE_DATASETS.json (Machine-readable)
│   └── DATASET_DOCUMENTATION.md (Initial seed data)
│
├── 🧪 TESTING
│   ├── backend/test_submissions.py (Automated tests)
│   └── backend/seed_data.py (Initial data seeding)
│
├── 📚 REFERENCE
│   ├── API_REFERENCE.md (API documentation)
│   ├── README.md (Project overview)
│   └── ARCHITECTURE.md (System design)
│
└── 🆘 SUPPORT
    ├── TROUBLESHOOTING.md (Common issues)
    ├── CONTRIBUTING.md (Guidelines)
    └── CHANGELOG.md (Version history)
```

---

**Ready to submit data? Start with [DATA_SUBMISSION_QUICK_GUIDE.md](DATA_SUBMISSION_QUICK_GUIDE.md)!** 🚀
