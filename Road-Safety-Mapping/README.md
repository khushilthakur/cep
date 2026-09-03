# 🚦 Road Safety Mapping Around Schools
### University of Mumbai — B.Sc. Computer Science Semester V
### Community Engagement Project (CEP) • Academic Year 2024–2025

---

## 📌 1. Project Title & Overview

**Project Title:** Road Safety Mapping Around Schools  
**Course Code / Curriculum:** B.Sc. Computer Science (Semester V) — Community Engagement Project (CEP)  
**Affiliation:** University of Mumbai  
**Domain:** Civic Technology, Child Road Safety, Spatial Data Science & Public Policy  

### Executive Summary
Road safety around schools in high-density urban areas like Mumbai is a critical public health and urban planning challenge. Every day, thousands of young students must navigate chaotic vehicular congestion, dangerous double parking at school gates, high-speed turning vehicles, encroached or non-existent sidewalks, and severely faded pedestrian crossings.

This project delivers a **professional, modern, and fully functional civic technology platform** built to study, record, analyse, and digitally map road safety hazards around educational institutions.

Rather than a basic awareness website, this platform is engineered around the **complete real-world CEP research pipeline**:
$$\text{Field Visit} \rightarrow \text{Observation} \rightarrow \text{Survey} \rightarrow \text{Data Collection} \rightarrow \text{Data Analysis} \rightarrow \text{Risk Identification} \rightarrow \text{Digital Risk Map} \rightarrow \text{Recommendations} \rightarrow \text{Report} \rightarrow \text{Viva}$$

---

## 🌟 2. Key Features & Functionality

1. **Interactive GIS Road Safety Map (`map.html`)**:
   - Built with **Leaflet.js** and **OpenStreetMap** (zero API keys required).
   - Dynamic **dual-theme tile switching**: CartoDB Positron for Light Mode and CartoDB Dark Matter for Dark Mode.
   - 4-tier custom SVG map markers:
     - 🔴 **High Risk Marker**: Pulsing radar animation for severe conflict points.
     - 🟠 **Medium Risk Marker**: Warning triangle badge for moderate hazards.
     - 🟢 **Low Risk Marker**: Shield check badge for maintenance spots.
     - 🏫 **School Hub Marker**: School crest with 500-meter study perimeter buffer circle.
   - Rich interactive popups featuring location name, ID, risk badge, identified hazard, field observation notes, date/time, photo preview, and mitigation remedy.
   - Real-time hazard filter buttons (`All`, `High`, `Medium`, `Low`), live search bar with instant pan-and-zoom, and deep-link query parameter support (`map.html?risk=R01`).

2. **14-Question Community Survey Engine (`survey.html`)**:
   - Structured 14-parameter questionnaire tailored to students, parents, teachers, and neighbourhood residents.
   - Client-side validation with smooth scroll to unfulfilled questions.
   - Persistent `localStorage` data storage (`cep_survey_responses`).
   - Live local responses count badge.
   - Interactive submission receipt card.
   - **One-click JSON export**: Download all survey records as `cep-survey-responses-YYYY-MM-DD.json` for viva examination and statistical evaluation.

3. **Dynamic Statistical Analytics Dashboard (`results.html`)**:
   - Integrated with **Chart.js** with zero page reload required.
   - 4 interactive visualisations:
     - 🍩 **Transport Mode Distribution** (Doughnut Chart)
     - 📊 **Subjective Safety Perception** (Color-graded Bar Chart)
     - 📉 **Infrastructure Deficit Prevalence** (Horizontal Bar Chart)
     - ⏱️ **Commute Duration Analysis** (Bar Chart)
   - Real-time recalculation of summary metrics (% feeling unsafe, % reporting parking congestion, % identifying missing footpaths).
   - Dynamic data table rendering recent participant submissions.
   - Automatic chart palette switching on light/dark mode changes.

4. **Identified Risk Directory & Matrix (`risk-areas.html`)**:
   - Filterable cards grid and responsive table view toggle.
   - Quantitative risk scoring based on the international **Likelihood (1–5) × Severity (1–5) = Risk Score (1–25)** matrix protocol.
   - Direct deep-links to locate any spot instantly on the interactive map.

5. **Actionable Remedial Framework (`recommendations.html`)**:
   - Formulates recommendations across 4 strategic pillars:
     1. Civil & Road Infrastructure Engineering
     2. Traffic Calming & Speed Control
     3. Municipal Enforcement & School Gate Policies
     4. Student & Community Road Safety Education
   - Phased implementation roadmap (Immediate Phase 1, Short-Term Phase 2, Long-Term Smart City Reforms).

6. **Fieldwork Photo Evidence Gallery (`gallery.html`)**:
   - Categorized documentation covering School Gates, Road Junctions, Footpaths, Zebra Crossings, and Signage.
   - Interactive modal lightbox viewer with metadata, timestamps, and GPS coordinates.

7. **15-Stage Research Timeline (`methodology.html`)**:
   - Detailed visual flowchart tracing the academic progression from School Selection to University Viva Voce.
   - Data triangulation framework (Field Observations + Community Surveys + Spatial GIS Mapping).

8. **Dual-Theme Design System (Light & Dark Modes)**:
   - Sun/Moon toggle with persistent preference saved in `localStorage`.
   - WCAG AA accessible contrast across all forms, tables, modals, cards, popups, and charts.

---

## 🛠️ 3. Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Markup** | HTML5 Semantic Elements | High accessibility, SEO-friendly, clean DOM structure |
| **Styling & Theme** | Modern CSS3 + CSS Custom Properties | Pure CSS without Bootstrap or Tailwind overhead; zero build step |
| **Client Scripting** | Vanilla JavaScript (ES6+) | Native performance, modular architecture, easy for viva explanation |
| **Geographic Mapping** | Leaflet.js (v1.9.4) + OpenStreetMap | Lightweight open-source mapping with CartoDB dual-theme raster tiles |
| **Data Visualisation** | Chart.js (v4.4.1) | Dynamic, responsive HTML5 canvas charting with theme adaptiveness |
| **Data Storage** | Structured JSON + browser `localStorage` | Zero backend dependency; easily extensible to PHP/MySQL or Firebase |
| **Typography** | Native System Font Stack | Ultra-fast load times with zero external font dependencies |

---

## 📂 4. Project Folder Structure

```text
Road-Safety-Mapping/
├── index.html              # Homepage: Hero, dynamic counters, workflow, featured cards, CTA
├── about.html              # CEP context, study area profile, objectives & stakeholders
├── survey.html             # 14-question community survey with validation & local storage
├── map.html                # Interactive Leaflet.js + OpenStreetMap safety map with custom markers
├── risk-areas.html         # Comprehensive directory & cards/table of all risk spots
├── results.html            # Dynamic Chart.js analytics dashboard with percentages
├── recommendations.html    # Engineering, policy, and awareness recommendations
├── methodology.html        # 15-stage CEP methodology timeline & 5x5 Risk Matrix
├── gallery.html            # Fieldwork photo gallery with categories & lightbox modal
├── contact.html            # Stakeholder feedback form & researcher credentials
│
├── css/
│   └── style.css           # Complete modern design system with light/dark CSS variables
│
├── js/
│   ├── script.js           # Theme switcher, navbar, mobile menu, shared utilities, data loaders
│   ├── map.js              # Leaflet integration, markers, popups, filters, search, light/dark tiles
│   ├── charts.js           # Chart.js analytics, dynamic percentage calculator, theme sync
│   └── survey.js           # Form handling, validation, localStorage sync, JSON import/export
│
├── data/
│   ├── risk-data.json      # Structured risk locations with GPS coordinates, observations & solutions
│   └── survey-data.json    # 50 realistic baseline survey entries with dynamic recalculation
│
├── assets/
│   ├── images/             # Visual assets, school badges, high-clarity SVG diagrams
│   └── icons/              # Category and risk level SVGs
│
└── README.md               # Complete University viva guide, documentation, and data replacement steps
```

---

## 🚀 5. How to Run Locally

Because the project uses pure HTML5, CSS3, and modern Vanilla JavaScript fetching local JSON data via the `fetch()` API, it should be served through a local HTTP server to avoid browser CORS restrictions on `file://` protocols.

### Method 1: VS Code Live Server (Recommended)
1. Open the folder `Road-Safety-Mapping` in **Visual Studio Code**.
2. Right-click on `index.html` and select **"Open with Live Server"**.
3. The website will automatically launch at `http://127.0.0.1:5500/index.html`.

### Method 2: Python HTTP Server (Built-in)
Open PowerShell or Terminal in the `Road-Safety-Mapping` folder and execute:
```powershell
# For Python 3:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Method 3: Node.js `npx serve` or `http-server`
```bash
npx serve .
```

---

## 🔄 6. How to Replace Demo Data with Actual Field Data

The platform is designed so that a B.Sc. CS student can replace the demo data with their real field study data **without altering any core HTML or JavaScript code**.

### Step 1: Update School Information
Open `data/risk-data.json` and edit the `"school"` object:
```json
"school": {
  "name": "Your Selected School Name",
  "zone": "Area / Ward Name, Mumbai",
  "address": "Full Road Address, Mumbai 4000XX",
  "latitude": 19.1028,       // Replace with actual latitude
  "longitude": 72.8430,      // Replace with actual longitude
  "studentCount": 1200,      // Total school enrollment
  "gradeLevels": "Grades 1 to 10",
  "morningArrival": "07:00 AM - 07:45 AM",
  "afternoonDispersal": "01:30 PM - 02:15 PM",
  "studyRadiusMeters": 500
}
```

### Step 2: Add or Edit Risk Locations
In `data/risk-data.json`, update the `"riskLocations"` array with your actual field observations:
```json
{
  "id": "R01",
  "name": "School Main Gate Entrance",
  "latitude": 19.1028,
  "longitude": 72.8430,
  "riskLevel": "High",       // "High", "Medium", or "Low"
  "category": "Drop-off & Pedestrian Conflict",
  "problem": "Double parking blocking school gate.",
  "observation": "Heavy traffic observed between 1:15 PM and 2:00 PM.",
  "date": "2024-09-05",
  "time": "01:30 PM",
  "likelihoodScore": 4,      // 1 to 5
  "severityScore": 4,        // 1 to 5
  "riskScore": 16,           // likelihoodScore * severityScore
  "photo": "assets/images/my-actual-photo-01.jpg",
  "photoCaption": "Actual photo of main gate vehicle congestion.",
  "recommendation": "Construct designated drop-off bay and raised crosswalk.",
  "implementationPriority": "Immediate (Phase 1)"
}
```

### Step 3: Replace Field Photographs
1. Save your camera photos (e.g. `main-gate.jpg`, `junction.jpg`) into the folder `assets/images/`.
2. In `data/risk-data.json`, set the `"photo"` property to your image filename:
   ```json
   "photo": "assets/images/main-gate.jpg"
   ```
3. Update `gallery.html` image `src` attributes to display your real fieldwork photographs.

### Step 4: Populate Actual Survey Responses
- Option A: Conduct surveys online using the built-in `survey.html` page; responses will be saved automatically into the active dataset.
- Option B: Edit `data/survey-data.json` directly to paste your collected survey records into the `"responses"` array. All charts and percentages will automatically update!

---

## 🎓 7. University Viva Voce Q&A Guide

Prepare for your Semester V examination with these common questions:

### Q1: What is the primary objective of this Community Engagement Project (CEP)?
> **Answer:** The primary objective is to apply computational thinking and spatial data analysis to study real-world road safety vulnerabilities around schools. We conduct field observations, community surveys, and infrastructure audits to identify dangerous conflict points, map them on an interactive GIS map, and propose actionable civil and administrative remedies.

### Q2: Why did you choose Vanilla JavaScript instead of React, Angular, or Vue?
> **Answer:** For this CEP project, Vanilla JavaScript (ES6+) provides maximum performance, zero build dependencies, instant browser execution, and transparency. It allows examiners to see directly how asynchronous data loading (`fetch`), DOM manipulation, Leaflet mapping events, and Chart.js instances operate without being hidden behind complex framework abstractions.

### Q3: How does the Risk Assessment Matrix work?
> **Answer:** We use the standard international Risk Matrix:
> $$\text{Risk Score} = \text{Likelihood (1–5)} \times \text{Severity (1–5)}$$
> - **15–25 (High Risk):** Immediate priority intervention needed (e.g. raised pedestrian tables, traffic wardens).
> - **8–14 (Medium Risk):** Short-term infrastructure repairs (e.g. sidewalk decluttering, warning signage).
> - **1–7 (Low Risk):** Routine upkeep (e.g. repainting faded zebra stripes).

### Q4: How does the map switch between Light and Dark mode?
> **Answer:** When the theme toggle is clicked, a custom `themeChanged` event is dispatched across the `window`. The Leaflet controller (`js/map.js`) catches this event and swaps the tile layer dynamically between CartoDB Positron (`rastertiles/voyager`) and CartoDB Dark Matter (`dark_all`) without reloading the page or losing marker states.

### Q5: How is client data persisted without a database server?
> **Answer:** Baseline records are stored in human-readable JSON files (`risk-data.json`, `survey-data.json`). New user submissions are saved in the browser's `localStorage`. The application merges both datasets dynamically in JavaScript. In addition, users can export all survey data as a structured JSON file with one click.

---

## 🔮 8. Future Improvements (Scope for Expansion)

1. **PHP / MySQL Backend**: Migrating from client-side JSON to a relational database with RESTful API endpoints.
2. **Administrative Dashboard**: Password-protected admin portal for teachers or traffic police to review submissions.
3. **GPS Geolocation & Mobile App**: Progressive Web App (PWA) with device GPS to let students mark live road hazards on their phones.
4. **AI / Computer Vision Integration**: Automated pedestrian and vehicle counting from video feeds using OpenCV or TensorFlow.js.
5. **Multi-School Comparison**: Scaling the platform to map road safety across all schools in a municipal ward.

---

## 📄 9. Project License & Credits

- Developed for **University of Mumbai B.Sc. Computer Science Semester V CEP**.
- Map Data: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, © [CARTO](https://carto.com/attributions).
- Charting Engine: [Chart.js](https://www.chartjs.org/) (MIT License).
- Mapping Engine: [Leaflet.js](https://leafletjs.com/) (BSD 2-Clause License).
