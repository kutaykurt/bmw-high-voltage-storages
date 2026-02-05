import { useState, useEffect, useCallback, useRef } from 'react';
import type {
    BatteryStatus,
    TelemetryDataPoint,
    ChartDataPoint,
    CellWarning
} from '../types/battery';

// Utility to generate random value within range
const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

// Utility to clamp value within bounds
const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

// Generate realistic mock warnings
const generateWarnings = (soc: number, temp: number, cellVariance: number): CellWarning[] => {
    const warnings: CellWarning[] = [];
    const now = new Date();

    // Low SOC warning
    if (soc < 20) {
        warnings.push({
            id: 'low-soc-' + now.getTime(),
            cellIndex: -1,
            type: 'voltage_low',
            severity: soc < 10 ? 'critical' : 'warning',
            value: soc,
            threshold: 20,
            message: `Niedriger Ladestand: ${soc.toFixed(1)}%`,
            timestamp: now,
        });
    }

    // High temperature warning
    if (temp > 40) {
        warnings.push({
            id: 'high-temp-' + now.getTime(),
            cellIndex: Math.floor(Math.random() * 96),
            type: 'temp_high',
            severity: temp > 50 ? 'critical' : 'warning',
            value: temp,
            threshold: 40,
            message: `Erhöhte Zelltemperatur: ${temp.toFixed(1)}°C`,
            timestamp: now,
        });
    }

    // Cell variance warning
    if (cellVariance > 15) {
        warnings.push({
            id: 'cell-variance-' + now.getTime(),
            cellIndex: Math.floor(Math.random() * 96),
            type: 'variance',
            severity: cellVariance > 25 ? 'warning' : 'info',
            value: cellVariance,
            threshold: 15,
            message: `Zellvarianz erhöht: ${cellVariance.toFixed(1)}mV`,
            timestamp: now,
        });
    }

    return warnings;
};

// Initial battery status
const createInitialBatteryStatus = (): BatteryStatus => {
    const now = new Date();
    const initialSoc = randomInRange(45, 85);
    const nominalCapacity = 83.9; // BMW iX xDrive50 battery

    return {
        vehicleId: 'BMW-IX-2024-001',
        batteryPackId: 'HVB-GEN5-096S',
        modelName: 'BMW iX xDrive50',
        nominalCapacity,
        soc: {
            percentage: initialSoc,
            absoluteCapacity: (initialSoc / 100) * nominalCapacity,
            timestamp: now,
        },
        soh: {
            percentage: randomInRange(96, 99),
            cycleCount: Math.floor(randomInRange(50, 200)),
            estimatedRemainingCycles: Math.floor(randomInRange(1500, 2000)),
            degradationRate: randomInRange(0.8, 1.2),
        },
        temperature: {
            average: randomInRange(22, 28),
            min: randomInRange(20, 24),
            max: randomInRange(26, 32),
            cellVariance: randomInRange(2, 8),
            coolingActive: false,
            heatingActive: false,
            thermalRunawayRisk: 'low',
        },
        voltage: {
            packVoltage: randomInRange(380, 420),
            cellVoltageMin: randomInRange(3.6, 3.7),
            cellVoltageMax: randomInRange(3.8, 3.9),
            cellVariance: randomInRange(5, 15),
            cellCount: 96,
            ocv: randomInRange(385, 415),
            internalResistance: randomInRange(12, 18),
        },
        sop: {
            maxDischargePower: 400,
            maxChargePower: 195,
            thermalLimit: 100,
        },
        current: {
            instantaneous: 0,
            power: 0,
            direction: 'idle',
        },
        charging: {
            isCharging: true,
            chargerType: 'DC',
            maxChargingPower: 195,
            currentChargingPower: randomInRange(80, 150),
            estimatedTimeToFull: Math.floor(randomInRange(25, 45)),
            energyAdded: randomInRange(5, 20),
        },
        range: {
            optimistic: Math.floor(initialSoc * 6.3),
            realistic: Math.floor(initialSoc * 5.1),
            conservative: Math.floor(initialSoc * 4.2),
            averageConsumption: randomInRange(18, 22),
        },
        warnings: [],
        telemetryHistory: [],
        lastUpdated: now,
        connectionStatus: 'connected',
    };
};

// Format time for chart axis
const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export interface UseBatterySimulationReturn {
    batteryStatus: BatteryStatus;
    chartData: ChartDataPoint[];
    isSimulating: boolean;
    toggleSimulation: () => void;
    resetSimulation: () => void;
    exportTelemetry: () => void;
}

export const useBatterySimulation = (
    updateInterval: number = 2000
): UseBatterySimulationReturn => {
    const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>(
        createInitialBatteryStatus
    );
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [isSimulating, setIsSimulating] = useState<boolean>(true);
    const intervalRef = useRef<number | null>(null);

    // Simulate battery data update
    const updateBatteryData = useCallback(() => {
        setBatteryStatus((prev) => {
            const now = new Date();
            const isCharging = prev.charging.isCharging;

            // Calculate SOC change
            let socChange = 0;
            if (isCharging) {
                // Charging: increase SOC based on power
                const chargeRate = prev.charging.currentChargingPower / prev.nominalCapacity;
                socChange = (chargeRate * (updateInterval / 3600000)) * 100; // Convert to %
            } else {
                // Discharging: slight decrease
                socChange = -randomInRange(0.01, 0.05);
            }

            const newSocPercentage = clamp(prev.soc.percentage + socChange, 0, 100);

            // Simulate charging power curve (reduces as battery fills)
            let newChargingPower = prev.charging.currentChargingPower;
            if (isCharging) {
                if (newSocPercentage > 80) {
                    newChargingPower = prev.charging.maxChargingPower * (1 - (newSocPercentage - 80) / 40);
                } else {
                    newChargingPower = clamp(
                        prev.charging.currentChargingPower + randomInRange(-5, 8),
                        50,
                        prev.charging.maxChargingPower
                    );
                }
            }

            // Temperature simulation
            let newTemp = prev.temperature.average;
            if (isCharging && newChargingPower > 100) {
                newTemp = clamp(prev.temperature.average + randomInRange(0.05, 0.2), 20, 45);
            } else {
                newTemp = clamp(prev.temperature.average + randomInRange(-0.1, 0.1), 20, 35);
            }

            // Voltage simulation based on SOC
            const baseVoltage = 350 + (newSocPercentage / 100) * 80; // 350-430V range
            const newPackVoltage = baseVoltage + randomInRange(-2, 2);

            // Cell variance (increases slightly over time during high-power charging)
            const newCellVariance = isCharging && newChargingPower > 100
                ? clamp(prev.voltage.cellVariance + randomInRange(-0.5, 1), 5, 30)
                : clamp(prev.voltage.cellVariance + randomInRange(-0.5, 0.3), 5, 20);

            // Generate warnings based on current state
            const warnings = generateWarnings(newSocPercentage, newTemp, newCellVariance);

            // NEW: Stable consumption calculation
            // Instead of pure random, we slowly drift the consumption to make range stable
            const consumptionDrift = randomInRange(-0.2, 0.2);
            const consumption = clamp(prev.range.averageConsumption + consumptionDrift, 17, 23);

            // Calculate base range and apply a "smoothing" to avoid jumping numbers
            const baseRange = (newSocPercentage / 100) * prev.nominalCapacity / (consumption / 100);
            // Simple smoothing: 90% old value, 10% new value
            const smoothRealistic = Math.round(prev.range.realistic * 0.9 + baseRange * 0.1);

            // Create new telemetry data point
            const newTelemetryPoint: TelemetryDataPoint = {
                timestamp: now,
                power: isCharging ? newChargingPower : -randomInRange(5, 15),
                soc: newSocPercentage,
                temperature: newTemp,
                voltage: newPackVoltage,
            };

            // Keep last 60 data points (2 minutes of data at 2s intervals)
            const updatedHistory = [...prev.telemetryHistory, newTelemetryPoint].slice(-60);

            // Update estimated time to full
            const remainingCapacity = ((100 - newSocPercentage) / 100) * prev.nominalCapacity;
            const estimatedMinutes = isCharging && newChargingPower > 0
                ? Math.floor((remainingCapacity / newChargingPower) * 60)
                : 0;

            // Check if charging complete
            const chargingComplete = newSocPercentage >= 100;

            return {
                ...prev,
                soc: {
                    percentage: newSocPercentage,
                    absoluteCapacity: (newSocPercentage / 100) * prev.nominalCapacity,
                    timestamp: now,
                },
                temperature: {
                    ...prev.temperature,
                    average: newTemp,
                    min: newTemp - randomInRange(2, 4),
                    max: newTemp + randomInRange(2, 6),
                    cellVariance: Math.abs(newTemp - prev.temperature.average),
                    coolingActive: newTemp > 35,
                    heatingActive: newTemp < 15,
                    thermalRunawayRisk: newTemp > 55 ? 'high' : newTemp > 45 ? 'medium' : 'low',
                },
                voltage: {
                    ...prev.voltage,
                    packVoltage: newPackVoltage,
                    cellVoltageMin: newPackVoltage / 96 - randomInRange(0.01, 0.03),
                    cellVoltageMax: newPackVoltage / 96 + randomInRange(0.01, 0.03),
                    cellVariance: newCellVariance,
                    ocv: newPackVoltage + (isCharging ? -randomInRange(1, 3) : randomInRange(1, 4)),
                    internalResistance: clamp(prev.voltage.internalResistance + (newTemp > 40 ? 0.05 : -0.01), 10, 30),
                },
                sop: {
                    maxDischargePower: 400 * (prev.soh.percentage / 100) * (newTemp > 50 ? 0.6 : 1),
                    maxChargePower: 195 * (newSocPercentage > 85 ? 0.3 : 1),
                    thermalLimit: newTemp > 50 ? 50 : 100,
                },
                current: {
                    instantaneous: isCharging ? newChargingPower / (newPackVoltage / 1000) : -randomInRange(10, 30),
                    power: isCharging ? newChargingPower : -randomInRange(5, 15),
                    direction: isCharging ? 'charging' : newSocPercentage > 0 ? 'discharging' : 'idle',
                },
                charging: {
                    ...prev.charging,
                    isCharging: !chargingComplete && prev.charging.isCharging,
                    currentChargingPower: chargingComplete ? 0 : newChargingPower,
                    estimatedTimeToFull: estimatedMinutes,
                    energyAdded: prev.charging.energyAdded + (socChange / 100) * prev.nominalCapacity,
                },
                range: {
                    optimistic: Math.floor(smoothRealistic * 1.2),
                    realistic: smoothRealistic,
                    conservative: Math.floor(smoothRealistic * 0.8),
                    averageConsumption: consumption,
                },
                warnings,
                telemetryHistory: updatedHistory,
                lastUpdated: now,
            };
        });
    }, [updateInterval]);

    const exportTelemetry = useCallback(() => {
        const dataStr = JSON.stringify({
            vehicleId: batteryStatus.vehicleId,
            telemetry: batteryStatus.telemetryHistory.map(p => ({
                t: p.timestamp.toISOString(),
                p: p.power,
                v: p.voltage,
                soc: p.soc,
                temp: p.temperature
            }))
        }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `telemetry_${new Date().toISOString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }, [batteryStatus]);

    // Update chart data when telemetry changes
    useEffect(() => {
        const newChartData: ChartDataPoint[] = batteryStatus.telemetryHistory.map((point) => ({
            time: formatTime(point.timestamp),
            timestamp: point.timestamp.getTime(),
            power: Math.round(point.power * 10) / 10,
            soc: Math.round(point.soc * 10) / 10,
            temperature: Math.round(point.temperature * 10) / 10,
        }));
        setChartData(newChartData);
    }, [batteryStatus.telemetryHistory]);

    // Start/stop simulation
    useEffect(() => {
        if (isSimulating) {
            // Initial update
            updateBatteryData();

            intervalRef.current = window.setInterval(updateBatteryData, updateInterval);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isSimulating, updateInterval, updateBatteryData]);

    const toggleSimulation = useCallback(() => {
        setIsSimulating((prev) => !prev);
    }, []);

    const resetSimulation = useCallback(() => {
        setBatteryStatus(createInitialBatteryStatus());
        setChartData([]);
    }, []);

    return {
        batteryStatus,
        chartData,
        isSimulating,
        toggleSimulation,
        resetSimulation,
        exportTelemetry,
    };
};

export default useBatterySimulation;
