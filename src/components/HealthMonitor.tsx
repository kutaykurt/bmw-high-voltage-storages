import { motion } from 'framer-motion';
import { Heart, AlertTriangle, CheckCircle, Info, TrendingDown } from 'lucide-react';
import type { StateOfHealth, CellWarning, VoltageData } from '../types/battery';

interface HealthMonitorProps {
    soh: StateOfHealth;
    voltage: VoltageData;
    warnings: CellWarning[];
}

const HealthMonitor: React.FC<HealthMonitorProps> = ({ soh, voltage, warnings }) => {
    // Determine health status color
    const getHealthColor = (percentage: number): string => {
        if (percentage >= 90) return '#00D68F';
        if (percentage >= 80) return '#FFAA00';
        return '#FF3D71';
    };

    const healthColor = getHealthColor(soh.percentage);

    // Get severity icon and color
    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return { icon: AlertTriangle, color: '#FF3D71', bg: 'rgba(255, 61, 113, 0.15)' };
            case 'warning':
                return { icon: AlertTriangle, color: '#FFAA00', bg: 'rgba(255, 170, 0, 0.15)' };
            default:
                return { icon: Info, color: '#0095FF', bg: 'rgba(0, 149, 255, 0.15)' };
        }
    };

    return (
        <div className="glass-card glass-card-hover p-6 col-span-12 md:col-span-6 lg:col-span-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${healthColor}20` }}
                    >
                        <Heart className="w-5 h-5" style={{ color: healthColor }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Batteriezustand</h2>
                        <p className="text-sm text-gray-400">State of Health (SOH)</p>
                    </div>
                </div>
                <motion.div
                    className="status-badge"
                    style={{
                        backgroundColor: `${healthColor}15`,
                        color: healthColor,
                        border: `1px solid ${healthColor}30`,
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                >
                    {soh.percentage >= 90 ? (
                        <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Exzellent</span>
                        </>
                    ) : soh.percentage >= 80 ? (
                        <>
                            <Info className="w-3 h-3" />
                            <span>Gut</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="w-3 h-3" />
                            <span>Degradiert</span>
                        </>
                    )}
                </motion.div>
            </div>

            {/* SOH Display */}
            <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                    <svg width="100" height="100" className="transform -rotate-90">
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#2A2A35"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={healthColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 42}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{
                                strokeDashoffset: 2 * Math.PI * 42 * (1 - soh.percentage / 100),
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ filter: `drop-shadow(0 0 6px ${healthColor}40)` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white number-display">
                            {soh.percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Ladezyklen</span>
                        <span className="text-sm text-white font-medium number-display">
                            {soh.cycleCount}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Verbleibend</span>
                        <span className="text-sm text-white font-medium number-display">
                            ~{soh.estimatedRemainingCycles}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Degradation</span>
                        <span className="text-sm text-white font-medium number-display">
                            {soh.degradationRate.toFixed(2)}%/1000
                        </span>
                    </div>
                </div>
            </div>

            {/* Cell Variance */}
            <div className="bg-[#1A1A22] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Zellvarianz</span>
                    <span
                        className="text-sm font-medium number-display"
                        style={{
                            color: voltage.cellVariance > 20 ? '#FF3D71' : voltage.cellVariance > 10 ? '#FFAA00' : '#00D68F',
                        }}
                    >
                        {voltage.cellVariance.toFixed(1)} mV
                    </span>
                </div>
                <div className="h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background:
                                voltage.cellVariance > 20
                                    ? '#FF3D71'
                                    : voltage.cellVariance > 10
                                        ? '#FFAA00'
                                        : '#00D68F',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((voltage.cellVariance / 30) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0 mV</span>
                    <span>30 mV</span>
                </div>
            </div>

            {/* Warnings */}
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Warnmeldungen ({warnings.length})
                </h3>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {warnings.length > 0 ? (
                        warnings.map((warning, index) => {
                            const config = getSeverityConfig(warning.severity);
                            const Icon = config.icon;
                            return (
                                <motion.div
                                    key={warning.id}
                                    className="flex items-start gap-3 p-3 rounded-lg"
                                    style={{ backgroundColor: config.bg }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white">{warning.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {warning.timestamp.toLocaleTimeString('de-DE')}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#00D68F]/10">
                            <CheckCircle className="w-4 h-4 text-[#00D68F]" />
                            <span className="text-sm text-[#00D68F]">Keine Warnungen aktiv</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthMonitor;
