# NYVORA

# Intelligent Nutrition Monitoring & Weight Management Platform

Nyvora is a web-based platform designed to support patient monitoring, nutritional follow-up and biometric tracking through a centralized, intuitive and modular interface.

The platform enables healthcare professionals to register and manage patients, record biometric measurements, monitor nutritional progress, consult clinical history and visualize key indicators through dashboards and analytical tools.

This repository contains the implementation of **Nyvora**, developed following software engineering best practices as the academic project for the **SC-502 Web Client/Server Environment** course at **Universidad Fidélitas**.

---

# Project Vision

To provide a scalable foundation for digital wellness solutions by centralizing patient information, biometric measurements and nutritional monitoring processes into a single platform.

Nyvora has been designed as a modular application capable of evolving into a comprehensive healthcare solution through future integrations, advanced analytics and intelligent decision-support services.

---

# Current Scope

## Implemented Features

- User Authentication
- Dashboard with KPIs
- Dashboard Charts (Chart.js)
- Patient Management
- Biometric Metrics Management
- Clinical History
- Preventive Alerts
- Settings Module
- Login Internationalization (Spanish / English)
- Temporary Data Persistence (LocalStorage)
- Modular Frontend Architecture

## Features Under Development

- Backend Integration (PHP)
- MySQL Integration
- Authentication with Database
- Server-side Validation
- Persistent Data Storage

---

# Future Evolution

The following features remain outside the current academic scope and are documented as future phases of the platform.

- Google Health Connect Integration
- Wearables Integration
- Artificial Intelligence
- Smart Recommendations
- External APIs
- Automated Data Synchronization
- Enterprise Integrations
- Advanced Analytics
- Cloud Synchronization
- Mobile Companion Application

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Charts | Chart.js |
| Backend | PHP |
| Database | MySQL |
| Infrastructure | Docker |
| Version Control | Git & GitHub |

---

# System Architecture

```
                   User
                     │
                     ▼
        Frontend (HTML • CSS • JS)
                     │
                     ▼
             Backend (PHP)
                     │
                     ▼
             Database (MySQL)
```

Current implementation uses **LocalStorage** as temporary persistence while Backend integration is completed.

---

# Core Modules

## Authentication

- User Login
- Session Management
- Role Validation
- Login Internationalization (ES / EN)

---

## Dashboard

- General KPIs
- Dashboard Charts
- Patient Summary
- Active Alerts
- General Statistics
- Dynamic Information

---

## Patient Management

- Create Patients
- Edit Patients
- View Patient Information
- Search Patients
- Filter Patients
- Deactivate Patients

---

## Biometric Metrics

Manual registration of:

- Weight
- Body Mass Index (BMI)
- Body Fat Percentage
- Heart Rate
- Sleep Hours
- Daily Steps

Additional Features

- Automatic BMI Calculation
- Input Validation
- Dynamic Updates

---

## Clinical History

- Historical Records
- Date Filtering
- Patient Progress
- Clinical Observations
- Metric Evolution

---

## Preventive Alerts

- Rule-based Alerts
- Alert Priority
- Alert Status
- Patient Tracking
- Clinical History Access

---

## Settings

- General Configuration
- User Preferences
- Platform Options

---

# Development Team

| Team Member | Role |
|-------------|------|
| Josué David Montero Hernández | Frontend Developer / Solution Architect |
| Kevin Jiménez Sánchez | Frontend Developer |
| Derek Stuard Vega Barquero | Backend Developer |
| Sebastián Gondrez Acuña | Database Developer |

---

# Repository Structure

```
nyvora-sc502
│
├── frontend
│   ├── assets
│   ├── css
│   ├── js
│   ├── pages
│   └── index.html
│
├── backend
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   └── services
│
├── database
│   ├── scripts
│   ├── seeders
│   └── backups
│
├── docker
│
├── docs
│
├── screenshots
│
├── README.md
│
└── docker-compose.yml
```

---

# Directory Description

| Directory | Purpose |
|------------|---------|
| frontend | User Interface Development |
| backend | Business Logic and Services |
| database | Database Scripts and Models |
| docs | Project Documentation |
| docker | Docker Configuration |
| screenshots | Development Evidence |

---

# Development Workflow

Nyvora follows a modular development approach where each application layer is organized independently.

The Frontend is divided into reusable components, shared utilities and modular JavaScript files, allowing each module to evolve independently while maintaining a consistent architecture.

The Backend and Database are being developed in parallel and will progressively replace the temporary LocalStorage persistence currently used during Frontend validation.

GitHub is used as the main collaboration platform, allowing each team member to work through organized commits and controlled integration.

---

# Current Project Status

**Version**

```
1.0
```

**Status**

```
Frontend Completed

Database Structure Completed

Backend Integration In Progress

Final Integration Pending
```

---

# Current Progress

| Component | Status |
|-----------|--------|
| Login | Completed |
| Dashboard | Completed |
| Dashboard Charts | Completed |
| Patient Management | Completed |
| Metrics Module | Completed |
| Clinical History | Completed |
| Preventive Alerts | Completed |
| Settings | Completed |
| Internationalization (Login) | Completed |
| LocalStorage Persistence | Completed |
| Database Design | Completed |
| Backend | In Progress |
| MySQL Integration | In Progress |
| Docker | Initial Configuration |

---

# Academic Context

Nyvora is developed as the official project for the **SC-502 Web Client/Server Environment** course at **Universidad Fidélitas**.

The project applies software engineering principles, frontend development, backend development, database design, modular architecture, collaborative development and version control practices.

The current deliverable focuses on providing a fully functional Frontend together with the database design and the initial Backend implementation, preparing the platform for complete integration during the final stage of the project.

---

# Long-Term Vision

The current implementation represents the first functional version of Nyvora.

Future releases will focus on expanding the platform through cloud services, wearable devices, advanced analytics, artificial intelligence, automated recommendations and enterprise healthcare integrations while preserving the modular architecture established during this project.

---

# License

This project was developed exclusively for academic and educational purposes as part of the SC-502 course at Universidad Fidélitas.

Commercial use is not permitted without prior authorization from the project authors.

## License

Academic and educational use.
