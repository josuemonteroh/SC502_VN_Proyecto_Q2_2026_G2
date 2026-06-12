# NYVORA

## Intelligent Nutrition Monitoring & Weight Management Platform

Nyvora is a web-based platform designed to support patient monitoring, nutritional follow-up and biometric tracking through a centralized and intuitive interface.

The platform enables healthcare professionals and patients to manage health-related information, register biometric measurements, visualize historical trends and monitor key indicators through dashboards and analytical tools.

This repository contains the implementation of **Nyvora**, developed under real-world software engineering practices while serving as the academic project for the **SC-502 Web Client/Server Environment** course at **Universidad Fidélitas**.

---

## Project Vision

To provide a scalable foundation for digital wellness solutions by centralizing patient information, biometric measurements and health monitoring processes into a single platform.

Nyvora is conceived as a functional first version capable of evolving into more advanced healthcare and wellness solutions through future integrations, analytics and intelligent services.

---

## Current Scope

### Included Features

* User Authentication
* Patient Management
* Biometric Metrics Registration
* Dashboard Visualization
* Historical Tracking
* Alert Management
* Role-Based Access Control

### Future Evolution

The following features are documented as future phases and are not included in the current implementation:

* Google Health Connect Integration
* Wearables Integration
* Artificial Intelligence
* Smart Recommendations
* External APIs
* Automated Data Synchronization
* Enterprise Integrations
* Advanced Analytics

---

## Technology Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Frontend        | HTML5, CSS3, JavaScript |
| Backend         | PHP                     |
| Database        | MySQL                   |
| Infrastructure  | Docker                  |
| Version Control | GitHub                  |

---

## System Architecture

```text
User
   │
   ▼
Frontend
(HTML, CSS, JavaScript)
   │
   ▼
Backend
(PHP)
   │
   ▼
Database
(MySQL)
```

---

## Core Modules

### Authentication

* User login
* Session management
* Basic role validation

### Patient Management

* Create patients
* Edit patients
* View patient information
* Deactivate patients

### Metrics Management

Manual registration of:

* Weight
* BMI
* Body Fat Percentage
* Heart Rate
* Sleep Hours
* Daily Steps

### Dashboard

* Patient overview
* Key metrics
* Alerts summary
* General indicators

### Historical Tracking

* Historical metrics visualization
* Date filtering
* Trend analysis

### Alerts

* Rule-based alerts
* Monitoring of relevant health indicators

---

## Development Team

| Team Member                   | Role                                                               |
| ----------------------------- | ------------------------------------------------------------------ |
| Josué David Montero Hernández | Frontend Development, System Architecture & Technical Coordination |
| Kevin Jiménez Sánchez         | Frontend Development                                               |
| Derek Stuard Vega Barquero    | Backend Development                                                |
| Sebastián Gondrez Acuña       | Database Development                                               |

---

## Repository Structure

```text
nyvora-sc502
│
├── frontend
├── backend
├── database
├── docs
├── docker
├── screenshots
└── README.md
```

### Directory Description

| Directory   | Purpose                                    |
| ----------- | ------------------------------------------ |
| frontend    | User interface development                 |
| backend     | Business logic and application services    |
| database    | Database scripts, models and documentation |
| docs        | Project documentation and deliverables     |
| docker      | Container configuration                    |
| screenshots | Development evidence and visual progress   |

---

## Development Workflow

The project uses GitHub as the primary collaboration and version control platform. Team members work on independent development tasks while maintaining an organized integration process that ensures stability, traceability and collaboration throughout the development lifecycle.

---

## Project Status

🚧 Active Development

**Version:** 1.0

**Status:** Planning & Initial Development

---

## Academic Context

Nyvora is being developed as the official project for the **SC-502 Web Client/Server Environment** course at **Universidad Fidélitas**, applying software engineering, frontend development, backend development, database design and collaborative development practices.

---

## Long-Term Vision

The current version focuses on delivering a functional and complete platform within the project's academic scope. Future versions may expand into broader wellness and healthcare solutions through integrations, analytics, automation and intelligent decision-support services.

---

## License

Academic and educational use.
