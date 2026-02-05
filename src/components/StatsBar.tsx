import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, HardDrive } from 'lucide-react';
import type { BatteryStatus } from '../types/battery';

interface StatsBarProps {
    batteryStatus: BatteryStatus;
}

const StatsBar: React.FC<StatsBarProps> = ({ batteryStatus }) => {
    const stats = [
        {
            icon: Zap,
            label: 'Pack Kapazität',
            value: `${batteryStatus.nominalCapacity} kWh`,
            color: '#1C69D2',
        },
        {
            icon: Cpu,
            label: 'Zellkonfiguration',
            value: `${batteryStatus.voltage.cellCount}S`,
            color: '#00D68F',
        },
        {
            icon: Activity,
            label: 'Open Circuit Voltage (OCV)',
            value: `${batteryStatus.voltage.ocv.toFixed(1)} V`,
            color: '#FFAA00',
        },
        {
            icon: HardDrive,
            label: 'Innenwiderstand (R_i)',
            value: `${batteryStatus.voltage.internalResistance.toFixed(1)} mΩ`,
            color: '#FF3D71',
        },
    ];

    return (
        <motion.div
            className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.label}
                        className="glass-card p-4 flex items-center gap-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${stat.color}20` }}
                        >
                            <Icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-lg font-semibold text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default StatsBar;
