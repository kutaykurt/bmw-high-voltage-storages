# BMW i-Battery Performance Dashboard 🔋
### Frontend Development for High-Voltage Storages (Hiring Project)

This project is a high-performance, real-time monitoring dashboard for BMW High-Voltage Storage (HVS) systems, built with **React 19**, **TypeScript**, and **Framer Motion**. It is designed to bridge the gap between complex battery telemetry and intuitive engineering diagnostics.

![Project Status](https://img.shields.io/badge/Status-Ready_for_Evaluation-00D68F?style=for-the-badge&logo=bmw)
![Tech Stack](https://img.shields.io/badge/Stack-React_19_|_TS_|_Tailwind-1C69D2?style=for-the-badge)

## 🎯 Key Features

### 1. Real-Time Telemetry & Monitoring
- **Dynamic SOC & SOH Tracking**: Visualized through premium SVG gauges and progress indicators.
- **Live Power Curves**: Real-time plotting of power (kW) vs State of Charge (SOC) using Recharts, simulating CC/CV charging phases.
- **Thermal Management**: Real-time risk assessment (Thermal Runaway Risk) and cooling system status.

### 2. Deep Engineering Insights (BMW Specific)
- **Cell Matrix Visualizer**: Monitoring of **96 individual cells (96S configuration)**. Identifies voltage deviations instantly.
- **Electrical Physics Metrics**: Tracking of **Open Circuit Voltage (OCV)** and **Internal Resistance (Ri)** for advanced aging analysis.
- **State of Power (SOP)**: Dynamic power limit calculation based on battery health and thermal constraints.

### 3. Data Science Bridge (Python Integration)
- **Telemetry Export**: One-click JSON export feature, designed to provide standardized data for **Python (Pandas/NumPy)** workflows used by BMW Data Analysts.

## 🛠 Tech Stack
- **Framework**: React 19 (utilizing latest hooks for performance)
- **TypeScript**: Strict typing for complex automotive data structures
- **Aesthetics**: Custom BMW i-Design System (Dark Mode, Glassmorphism)
- **Animation**: Framer Motion (Automotive-grade micro-interactions)
- **Charts**: Recharts (High-performance telemetry plotting)

## 📋 Theoretical Background & Process
For a detailed look at the user journeys, architectural decisions, and the engineering logic behind the 96S monitoring, please refer to the **[DESIGN.md](./DESIGN.md)** file.

## 🚀 Getting Started
1. Clone the repository
2. Run `npm install`
3. Start the dev server with `npm run dev`
4. Access the dashboard at `http://localhost:5173`

---
*Created as part of the application process for the 'Intern Frontend Development for High-Voltage Storages' position at BMW Group, Munich.*
