import { motion } from 'framer-motion';
import { Battery, Zap, Thermometer } from 'lucide-react';
import type { StateOfCharge, TemperatureData, VoltageData, ChargingSession } from '../types/battery';

interface BatteryGaugeProps {
    soc: StateOfCharge;
    temperature: TemperatureData;
    voltage: VoltageData;
    charging: ChargingSession;
}

const BatteryGauge: React.FC<BatteryGaugeProps> = ({
    soc,
    temperature,
    voltage,
    charging,
}) => {
    // Determine color based on SOC level
    const getSOCColor = (percentage: number): string => {
        if (percentage >= 60) return '#00D68F'; // Green
        if (percentage >= 30) return '#FFAA00'; // Yellow
        return '#FF3D71'; // Red
    };

    const socColor = getSOCColor(soc.percentage);

    // Calculate circumference for SVG circle
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (soc.percentage / 100) * circumference;

    return (
        <div className="glass-card glass-card-hover p-8 col-span-12 lg:col-span-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${socColor}20` }}
                    >
                        <Battery className="w-5 h-5" style={{ color: socColor }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Batteriestand</h2>
                        <p className="text-sm text-gray-400">State of Charge (SOC)</p>
                    </div>
                </div>
                {charging.isCharging && (
                    <motion.div
                        className="status-badge success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <Zap className="w-3 h-3" />
                        <span>Lädt</span>
                    </motion.div>
                )}
            </div>

            {/* Main Gauge */}
            <div className="flex items-center justify-center py-8">
                <div className="relative">
                    {/* Background Circle */}
                    <svg width="280" height="280" className="transform -rotate-90">
                        {/* Track */}
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="none"
                            stroke="#2A2A35"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />
                        {/* Progress */}
                        <motion.circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="none"
                            stroke={socColor}
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                filter: `drop-shadow(0 0 10px ${socColor}40)`,
                            }}
                        />
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-6xl font-bold text-white number-display"
                            key={Math.floor(soc.percentage)}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {soc.percentage.toFixed(1)}
                        </motion.span>
                        <span className="text-2xl text-gray-400 font-light">%</span>
                        <div className="mt-2 text-sm text-gray-500">
                            {soc.absoluteCapacity.toFixed(1)} kWh
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                {/* Temperature */}
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-gray-400">Temperatur</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-semibold text-white number-display">
                            {temperature.average.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">°C</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {temperature.min.toFixed(0)}° - {temperature.max.toFixed(0)}°
                    </div>
                </div>

                {/* Voltage */}
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-gray-400">Spannung</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-semibold text-white number-display">
                            {voltage.packVoltage.toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-400">V</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {voltage.cellCount} Zellen
                    </div>
                </div>

                {/* Charging Power */}
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#1C69D2]" />
                        <span className="text-xs text-gray-400">Ladeleistung</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-semibold text-white number-display">
                            {charging.currentChargingPower.toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-400">kW</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Max: {charging.maxChargingPower} kW
                    </div>
                </div>
            </div>

            {/* Charging Progress */}
            {charging.isCharging && (
                <motion.div
                    className="mt-6 p-4 bg-[#1A1A22] rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Ladefortschritt</span>
                        <span className="text-sm text-[#1C69D2]">
                            ~{charging.estimatedTimeToFull} min verbleibend
                        </span>
                    </div>
                    <div className="h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, #1C69D2 0%, #3D8BF2 100%)',
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${soc.percentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>+{charging.energyAdded.toFixed(1)} kWh geladen</span>
                        <span>{charging.chargerType} Schnellladen</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BatteryGauge;
