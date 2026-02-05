import { motion } from 'framer-motion';
import { Navigation, Gauge, Leaf, Wind } from 'lucide-react';
import type { RangePrediction, StateOfCharge } from '../types/battery';

interface RangePredictorProps {
    range: RangePrediction;
    soc: StateOfCharge;
}

const RangePredictor: React.FC<RangePredictorProps> = ({ range, soc }) => {
    // Animation variants for range values
    const numberVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="glass-card glass-card-hover p-6 col-span-12 md:col-span-6 lg:col-span-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Reichweite</h2>
                        <p className="text-sm text-gray-400">Range Prediction</p>
                    </div>
                </div>
            </div>

            {/* Main Range Display */}
            <div className="text-center mb-8">
                <motion.div
                    className="inline-block"
                    key={range.realistic}
                    variants={numberVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-6xl font-bold text-white number-display">
                        {range.realistic}
                    </span>
                    <span className="text-2xl text-gray-400 ml-2">km</span>
                </motion.div>
                <p className="text-sm text-gray-500 mt-2">Realistische Schätzung</p>
            </div>

            {/* Range Scenarios */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Optimistic */}
                <div className="bg-[#1A1A22] rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                        <Leaf className="w-4 h-4 text-green-400" />
                    </div>
                    <motion.p
                        className="text-xl font-bold text-white number-display"
                        key={`opt-${range.optimistic}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        {range.optimistic}
                    </motion.p>
                    <p className="text-xs text-gray-500">Optimal</p>
                </div>

                {/* Realistic */}
                <div className="bg-[#1C69D2]/20 rounded-xl p-4 text-center border border-[#1C69D2]/30">
                    <div className="w-8 h-8 rounded-lg bg-[#1C69D2]/30 flex items-center justify-center mx-auto mb-2">
                        <Navigation className="w-4 h-4 text-[#1C69D2]" />
                    </div>
                    <motion.p
                        className="text-xl font-bold text-[#1C69D2] number-display"
                        key={`real-${range.realistic}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        {range.realistic}
                    </motion.p>
                    <p className="text-xs text-gray-400">Realistisch</p>
                </div>

                {/* Conservative */}
                <div className="bg-[#1A1A22] rounded-xl p-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                        <Wind className="w-4 h-4 text-orange-400" />
                    </div>
                    <motion.p
                        className="text-xl font-bold text-white number-display"
                        key={`cons-${range.conservative}`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        {range.conservative}
                    </motion.p>
                    <p className="text-xs text-gray-500">Konservativ</p>
                </div>
            </div>

            {/* Consumption Info */}
            <div className="bg-[#1A1A22] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Ø Verbrauch</span>
                    </div>
                    <span className="text-sm font-medium text-white number-display">
                        {range.averageConsumption.toFixed(1)} kWh/100km
                    </span>
                </div>

                {/* Efficiency Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background:
                                    range.averageConsumption < 18
                                        ? 'linear-gradient(90deg, #00D68F, #00D68F)'
                                        : range.averageConsumption < 22
                                            ? 'linear-gradient(90deg, #1C69D2, #3D8BF2)'
                                            : 'linear-gradient(90deg, #FFAA00, #FF7700)',
                            }}
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min((range.averageConsumption / 30) * 100, 100)}%`,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span
                        className="text-xs font-medium"
                        style={{
                            color:
                                range.averageConsumption < 18
                                    ? '#00D68F'
                                    : range.averageConsumption < 22
                                        ? '#1C69D2'
                                        : '#FFAA00',
                        }}
                    >
                        {range.averageConsumption < 18
                            ? 'Effizient'
                            : range.averageConsumption < 22
                                ? 'Normal'
                                : 'Hoch'}
                    </span>
                </div>
            </div>

            {/* Range Bar Visualization */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">0 km</span>
                    <span className="text-xs text-gray-500">{range.optimistic} km</span>
                </div>
                <div className="relative h-4 bg-[#2A2A35] rounded-full overflow-hidden">
                    {/* Conservative zone */}
                    <motion.div
                        className="absolute h-full bg-orange-500/40"
                        style={{ left: 0 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(range.conservative / range.optimistic) * 100}%` }}
                        transition={{ duration: 0.8 }}
                    />
                    {/* Realistic zone */}
                    <motion.div
                        className="absolute h-full bg-[#1C69D2]/60"
                        style={{ left: 0 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(range.realistic / range.optimistic) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    />
                    {/* Current marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                        style={{
                            left: `calc(${(range.realistic / range.optimistic) * 100}% - 6px)`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RangePredictor;
