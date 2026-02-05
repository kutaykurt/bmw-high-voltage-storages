# BMW i-Battery Dashboard - Design & Architecture Documentation

## Project Vision
To create a high-performance monitoring interface for high-voltage storage systems that bridges the gap between raw vehicle telemetry and actionable engineering insights.

## User Journey: Battery Diagnosis Engineer
1. **Overview**: Monitoring of the SOC and SOH across the pack to identify degradation patterns.
2. **Deep Dive**: Using the **Cell-Matrix** to identify specific cell voltage deviations that could indicate a faulty module.
3. **Data Analysis**: Exporting real-time telemetry into JSON format for further processing in **Python (Pandas/Jupyter)** to perform predictive maintenance modeling.
4. **Safety Monitoring**: Real-time tracking of **Thermal Runaway Risk** and **State of Power (SOP)** limits to ensure operation within the safe thermal window.

## Software Architecture
- **Framework**: React 19 (Concurrent Rendering for 2s telemetry updates).
- **State Management**: Custom Hook `useBatterySimulation` simulating a WebSocket-style data stream.
- **Visuals**: Framer Motion for premium automotive-grade animations; Recharts for robust telemetry plotting.
- **Data Model**: Strictly typed interfaces covering electrical engineering metrics (OCV, Impedance, SOP).

## Electromobility Engineering Specs
- **Cells**: Simulated 96S (96 cells in series) lithium-ion configuration.
- **Telemetry**: 2000ms polling rate (simulated).
- **Logic**: Dynamic charging power curves (CC/CV phase simulation).
- **Integration**: Designed for JSON-based data exchange with Python-based backend analysis tools.

## Developer Connection (Python/Data Science)
The "Data Export" feature provides a standardized JSON schema that matches common Python data analysis requirements:
```json
{
  "vehicleId": "BMW-IX-2024-001",
  "telemetry": [
    { "t": "2026-02-05T14:00:00Z", "p": 150.5, "v": 400.2, "soc": 80.5, "temp": 35.2 }
  ]
}
```
