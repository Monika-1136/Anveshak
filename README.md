# AI-Powered Cyber Forensic Triage Tool

> Accelerating Cybercrime Investigations with Intelligent Automation

## Table of Contents

- Overview
- Problem Statement
- Key Features
- System Architecture
- Technology Stack
- Installation
- Usage
- Project Structure
- API Documentation
- Features Implementation
- Development Guide
- Troubleshooting
- Contributing
- License

***

## Overview

The AI-Powered Cyber Forensic Triage Tool is a next-generation forensic investigation system designed to address the rising complexity and volume of cybercrime cases. The platform automates the tedious aspects of digital forensic triage by employing AI/ML models for anomaly detection, evidence scoring, and intelligent visualization, enabling investigators to focus on the most critical evidence first.

### Executive Summary

Traditional methods for analyzing forensic evidence are:
- Time-intensive (days → hours with our solution)
- Error-prone
- Lack AI-driven prioritization
- Difficulty building coherent timelines

Our solution provides:
- Automated ingestion of diverse evidence formats
- AI-powered anomaly detection
- Timeline reconstruction
- Interactive dashboards
- Standardized, court-ready reports
- Chain-of-custody compliance

***

## Problem Statement

1. Data Overload: Investigators face massive amounts of digital evidence (logs, memory dumps, emails, network captures, disk images)
2. Manual Process: Manual forensic triage is slow, repetitive, and prone to human error
3. Lack of Intelligence: Traditional tools lack AI-driven prioritization and adaptive learning capabilities
4. Unstructured Evidence: Difficulty building coherent timelines from unstructured data
5. Reporting Challenges: Generating standardized, legally admissible reports is time-consuming and inconsistent

***

## Key Features

### Evidence Management
- Universal Evidence Import: Supports .log, .txt, .pcap, .pcapng, .raw, .mem, .bin, .img, .dd, .E01, .iso, .vmdk, .eml, .pst, .mbox, .json, .csv, .xml, .gz, .zip, .tar
- Drag & Drop Upload: Intuitive file upload interface
- Evidence Queue: Track all uploaded files with metadata
- Chain of Custody: Automated SHA-256 hashing, timestamps, and verification status

### AI/ML Analysis
- Anomaly Detection: Identifies unusual login attempts, privilege escalations, hidden processes, data exfiltration
- Adaptive ML Models: Combination of supervised and unsupervised learning techniques
- Smart Evidence Scoring: Weighted scoring algorithm to prioritize artifacts
- Threat Intelligence Integration: Links with MITRE ATT&CK, VirusTotal, external threat feeds

### Visualization & Reporting
- Interactive Dashboards: Heatmaps, anomaly graphs, event correlation maps
- Forensic Timeline Generator: Chronological mapping of activities
- Analysis Results Browser: View all past analyses with detailed reports
- Chart Integration: Bar charts, pie charts for findings distribution
- AI Assistant: Contextual help for interpreting analysis results

### Case Management
- Multi-Case Support: Track multiple investigations simultaneously
- Case Details: View case ID, name, priority, assigned investigator, files
- Assignment Workflow: Assign investigators to cases from Custody section
- Role-Based Access Control: Admin, Senior Investigator, Investigator, Analyst, Viewer roles

### User Management
- Investigator Management: Add, remove, and manage team members
- Role Assignment: Change roles with granular permissions
- Workload Tracking: Monitor case assignments per investigator
- Audit Logs: Track all user actions and role changes

***

## System Architecture

### Core Modules

1. Evidence Intake Layer
- Multi-format support (disk images, logs, memory dumps, pcap, cloud logs)
- Data normalization and indexing
- File metadata extraction (size, hash, timestamp)

2. Pre-Processing Layer
- Metadata extraction (timestamps, hashes, file types)
- Artifact parsing (registry, browser, email headers, API logs)
- Data enrichment with threat intelligence feeds

3. AI/ML Engine
- Unsupervised Learning: Clustering anomalies (Isolation Forest, Autoencoders, DBSCAN)
- Supervised Models: Classification of suspicious behaviors
- NLP Models: Email analysis, chat log analysis, phishing detection
- Deep Learning: CNN/RNN for malware pattern detection

4. Timeline & Correlation Module
- Event correlation across multiple devices and accounts
- Timeline reconstruction for user/system activities

5. Visualization & Dashboard Layer
- Interactive charts, heatmaps, node graphs
- Case-wise dashboard for investigators
- Three-panel analysis interface (list, report, AI assistant)

6. Reporting & Export Engine
- Generates standardized, legally admissible reports
- Supports export to PDF/HTML/JSON

***

## Technology Stack

### Backend
- Framework: Flask (Python)
- API: RESTful endpoints
- CORS: Flask-CORS for cross-origin requests
- File Storage: Local filesystem (backend/results/)

### Frontend
- Framework: React 18+ with TypeScript
- Routing: React Router DOM v6
- State Management: React Context API
- UI Components: Custom components with dark theme
- Charts: Chart.js, react-chartjs-2
- Build Tool: Vite
- Styling: CSS Modules with dark theme (#1a1d24 background)

### Security
- Authentication: YubiKey Bio support
- Hashing: SHA-256 for chain of custody
- HTTPS: TLS 1.3 ready
- RBAC: Role-Based Access Control

---

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Backend Setup

Navigate to backend directory:
cd backend

Create virtual environment:
python -m venv venv

Activate virtual environment:
Windows: venv\Scripts\activate
Linux/Mac: source venv/bin/activate

Install dependencies:
pip install flask flask-cors

Create results directory:
mkdir results

Run backend server:
python app.py

Backend will run on http://127.0.0.1:5000

### Frontend Setup

Navigate to frontend directory:
cd frontend

Install dependencies:
npm install

Install additional packages:
npm install react-router-dom
npm install react-chartjs-2 chart.js

Start development server:
npm run dev

Frontend will run on http://localhost:5173 (Vite default)

***

## Usage

### 1. Evidence Upload
1. Navigate to Evidence Intake tab
2. Click Browse Files or drag & drop files into the upload area
3. View uploaded files in the Evidence Queue with metadata

### 2. Analysis
1. Click Analyze Queued Files button
2. System redirects to AI Analysis tab
3. Backend processes file and stores results in backend/results/
4. View analysis progress with loading indicator
5. Results appear with threat score, risk level, findings, charts, and recommendations

### 3. AI Analysis Review
Left Panel - Analysis List: Browse all past analyses
Center Panel - Report Display: View threat score, findings, charts, recommendations
Right Panel - AI Assistant: Ask questions about the analysis

### 4. Case Management
1. Navigate to Cases tab
2. View all cases with case ID, name, status, priority, assigned investigator
3. Click any case to view detailed information

### 5. User Management (Custody)
Go to Custody → User Settings → Manage User Roles
- Add Investigator: Add team members
- Remove Investigator: Remove investigators
- Assign Work: Assign cases to investigators

***

## Project Structure

cyber-forensic-tool/
├── backend/
│   ├── app.py (Flask backend server)
│   ├── results/ (Analysis JSON storage)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EvidenceIntake.tsx
│   │   │   ├── AIAnalysis.tsx
│   │   │   ├── Cases.tsx
│   │   │   ├── CaseDetails.tsx
│   │   │   └── Custody.tsx
│   │   ├── contexts/
│   │   │   └── CasesContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md

***

## API Documentation

### Backend Endpoints

1. Upload Evidence File
POST /upload
Content-Type: multipart/form-data
Form Data: files (File object)

2. List All Analyses
GET /analysis/list

3. Get Specific Analysis
GET /analysis/results/<filename>

***

## Troubleshooting

### Common Issues

1. CORS Errors
Solution: Enable CORS in Flask with flask_cors

2. Port Already in Use
Solution: Kill process on port 5000

3. Module Not Found
Solution: Ensure virtual environment is activated and dependencies installed

4. Failed to Fetch Analysis
Solution: Verify backend is running, check CORS, verify file upload

5. ALTS Credentials Warning
Solution: Harmless gRPC warning - can be ignored

***

## Future Enhancements

- Federated Learning
- NLP Report Generation
- Blockchain Chain-of-Custody
- Explainable AI (XAI)
- Voice & Chat Log Analysis
- Cloud-Native Agent
- Timeline Visualization
- Export Reports
- Advanced Search

***

## Project Status

Current Version: 1.0.0-beta
Status: Active Development
Last Updated: October 12, 2025

### Completed Milestones
✅ Evidence intake system
✅ Backend API structure
✅ AI analysis integration
✅ Case management system
✅ User management with RBAC
✅ Three-panel analysis interface
✅ Chart visualization
✅ AI assistant chat

***

Built by team Root@Hackers with ❤️ for cybersecurity investigators worldwide

***
