/**
 * BMW High-Voltage Battery Data Types
 * Based on real automotive HV battery telemetry specifications
 */

// State of Charge (SOC) - Current battery charge level
export interface StateOfCharge {
    percentage: number; // 0-100%
    absoluteCapacity: number; // kWh remaining
    timestamp: Date;
}

// State of Health (SOH) - Battery degradation status
export interface StateOfHealth {
    percentage: number; // 0-100%, 100% = new battery
    cycleCount: number; // Total charge cycles
    estimatedRemainingCycles: number;
    degradationRate: number; // % per 1000 cycles
}

// Battery Temperature Data
export interface TemperatureData {
    average: number; // °C
    min: number; // °C
    max: number; // °C
    cellVariance: number; // Temperature difference between cells
    coolingActive: boolean;
    heatingActive: boolean;
    thermalRunawayRisk: 'low' | 'medium' | 'high';
}

// Voltage & Electrical Physics Data
export interface VoltageData {
    packVoltage: number; // V - Total pack voltage
    cellVoltageMin: number; // V - Lowest cell
    cellVoltageMax: number; // V - Highest cell
    cellVariance: number; // mV - Variance between cells
    cellCount: number; // Number of cells in series
    ocv: number; // Open Circuit Voltage (V)
    internalResistance: number; // mOhm - Crucial for battery aging analysis
}

// State of Power (SOP) - Power availability for drive/charge
export interface StateOfPower {
    maxDischargePower: number; // kW
    maxChargePower: number; // kW
    thermalLimit: number; // % limit applied by BMS
}

// Current Flow Data
export interface CurrentData {
    instantaneous: number; // A - Current flow (+ charging, - discharging)
    power: number; // kW - Instantaneous power
    direction: 'charging' | 'discharging' | 'idle';
}

// Charging Session Data
export interface ChargingSession {
    isCharging: boolean;
    chargerType: 'AC' | 'DC' | 'none';
    maxChargingPower: number; // kW
    currentChargingPower: number; // kW
    estimatedTimeToFull: number; // minutes
    energyAdded: number; // kWh added in current session
}

// Cell-level Warning
export interface CellWarning {
    id: string;
    cellIndex: number;
    type: 'voltage_high' | 'voltage_low' | 'temp_high' | 'temp_low' | 'variance';
    severity: 'info' | 'warning' | 'critical';
    value: number;
    threshold: number;
    message: string;
    timestamp: Date;
}

// Range Prediction
export interface RangePrediction {
    optimistic: number; // km - Best case
    realistic: number; // km - Average driving
    conservative: number; // km - Worst case (AC, highway)
    averageConsumption: number; // kWh/100km
}

// Time-series data point for charts
export interface TelemetryDataPoint {
    timestamp: Date;
    power: number; // kW
    soc: number; // %
    temperature: number; // °C
    voltage: number; // V
}

// Complete Battery Status
export interface BatteryStatus {
    vehicleId: string;
    batteryPackId: string;
    modelName: string;
    nominalCapacity: number; // kWh
    soc: StateOfCharge;
    soh: StateOfHealth;
    temperature: TemperatureData;
    voltage: VoltageData;
    current: CurrentData;
    charging: ChargingSession;
    range: RangePrediction;
    sop: StateOfPower;
    warnings: CellWarning[];
    telemetryHistory: TelemetryDataPoint[];
    lastUpdated: Date;
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

// Chart data formatted for Recharts
export interface ChartDataPoint {
    time: string;
    timestamp: number;
    power: number;
    soc: number;
    temperature: number;
}

// Dashboard Configuration
export interface DashboardConfig {
    refreshInterval: number; // ms
    showWarnings: boolean;
    showPredictions: boolean;
    chartTimeRange: '1min' | '5min' | '15min' | '30min';
    units: {
        temperature: 'celsius' | 'fahrenheit';
        distance: 'km' | 'miles';
    };
}
