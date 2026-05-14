# Project Proposal: DuckSupport Dashboard

**Authors:** Noel Gilliland, Hiro Nakae, Reed Nystrom, Harrison Ramos  
**Date:** May 13, 2026

The following document is a project proposal for the DuckSupport software to be developed for CS 422 Software Methodologies. Page 1 describes the Concept of Operations (ConOps) based on the structure in image.png, and page 2 proposes a Software Design Specification (SDS).

## 1. Concept of Operations (ConOps)

### 2.1. Current System or Situation

Currently, the University of Oregon Basic Needs Program and the Dean of Students Care Team in Eugene manage student resource allocation through fragmented, manual processes. Staff often rely on disparate spreadsheets to track the availability of emergency funds, food pantry inventory, and external community grants, leading to potential delays in student support.

### 2.2. Justification for a New System

Manual tracking creates "data silos" where real-time resource availability is not visible to all team members simultaneously. DuckSupport is justified by the need for a centralized, real-time triage system that ensures benefits navigators can immediately match a student's crisis with the available campus or community resources.

### 2.3. Operational Features of the Proposed System

- **Real-Time Inventory Triage:** A live dashboard showing current levels of physical goods and available emergency financial aid.
- **Automated Threshold Alerts:** System-generated notifications when specific resources drop below a critical level.
- **Referral Status Pipeline:** A visual workflow to track students from their initial intake through to successful resource acquisition.
- **Resource Demand Analytics:** Visualization tools to help UO managers identify trends in student needs for better budget planning.

### 2.4. User Classes

- **Basic Needs Navigators:** Front-line staff who use the system to log intake and verify inventory.
- **Care Team Managers:** Administrative users who utilize analytics to oversee operations and manage resource thresholds.

## 2. Software Design Specification (SDS)

### 1. SDS Revision History

Current (Draft) - May 13, 2026

### 2. Software Overview

DuckSupport is a web-based triage application designed to optimize the internal operations of student support services. It provides a centralized hub for managing resource inventory and tracking the status of student referrals.

### 3. Software Architecture: Layered

The system utilizes a 4-tier layered architecture, leveraging modern full-stack technologies:

- **Presentation Layer:** Accessible via standard web browsers.
- **Client/Frontend Layer:** Built with Next.js and TypeScript for a robust, type-safe user experience.
- **Application/API Layer:** A FastAPI (Python) REST interface managing business logic and alert triggers.
- **Data Layer:** A relational database (utilizing Supabase or SQLite3) for persistent storage of resource data and referral logs.

### 4. Software Modules

- **Inventory Manager (Frontend):** Interface for staff to adjust stock levels and view real-time fund balances.
- **Triage Engine (API):** Backend logic that prioritizes student referrals based on urgency and available resources.
- **Analytics Dashboard (Recharts):** A specialized module using Recharts to provide composable, responsive data visualizations for tracking resource depletion and student need trends.

### 5. Dynamic Models of Operational Scenarios

- **Scenario A:** A navigator logs a new donation; Recharts instantly updates the "Inventory Levels" bar graph to reflect the new totals across all staff dashboards.
- **Scenario B:** An automated alert is triggered when the "Emergency Housing Fund" falls below a 10% threshold, highlighting the relevant data point in red on the manager's analytics view.

### 6. Acknowledgements

Project Team + UO Basic Needs Program + AI Collaboration.
