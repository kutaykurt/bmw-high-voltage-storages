import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';
import type { ChartDataPoint } from '../types/battery';

interface LiveChartProps {
    data: ChartDataPoint[];
    isSimulating: boolean;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip">
            <p className="text-sm font-medium text-white mb-2">{label}</p>
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-400">{entry.name}:</span>
                    <span className="text-white font-medium">
                        {entry.value.toFixed(1)} {entry.name === 'Leistung' ? 'kW' : entry.name === 'SOC' ? '%' : '°C'}
                    </span>
                </div>
            ))}
        </div>
    );
};

const LiveChart: React.FC<LiveChartProps> = ({ data, isSimulating }) => {
    // Calculate average power
    const avgPower = useMemo(() => {
        if (data.length === 0) return 0;
        const sum = data.reduce((acc, point) => acc + point.power, 0);
        return sum / data.length;
    }, [data]);

    // Calculate max power
    const maxPower = useMemo(() => {
        if (data.length === 0) return 0;
        return Math.max(...data.map((point) => point.power));
    }, [data]);

    return (
        <div className="glass-card glass-card-hover p-6 col-span-12 lg:col-span-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1C69D2]/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-[#1C69D2]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Live-Ladekurve</h2>
                        <p className="text-sm text-gray-400">Echtzeit-Telemetriedaten</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isSimulating && (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="w-2 h-2 rounded-full bg-[#00D68F]"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-xs text-gray-400">LIVE</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-[#1C69D2]" />
                        <span className="text-xs text-gray-400">Aktuelle Leistung</span>
                    </div>
                    <span className="text-2xl font-bold text-white number-display">
                        {data.length > 0 ? data[data.length - 1].power.toFixed(1) : '0.0'}
                        <span className="text-sm text-gray-400 ml-1">kW</span>
                    </span>
                </div>
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-[#00D68F]" />
                        <span className="text-xs text-gray-400">Ø Leistung</span>
                    </div>
                    <span className="text-2xl font-bold text-white number-display">
                        {avgPower.toFixed(1)}
                        <span className="text-sm text-gray-400 ml-1">kW</span>
                    </span>
                </div>
                <div className="bg-[#1A1A22] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-[#FFAA00]" />
                        <span className="text-xs text-gray-400">Max. Leistung</span>
                    </div>
                    <span className="text-2xl font-bold text-white number-display">
                        {maxPower.toFixed(1)}
                        <span className="text-sm text-gray-400 ml-1">kW</span>
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] mt-4">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1C69D2" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#1C69D2" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="socGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D68F" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#00D68F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#2A2A35"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="time"
                                stroke="#4A4A55"
                                tick={{ fill: '#6B6B75', fontSize: 11 }}
                                tickLine={false}
                                axisLine={{ stroke: '#2A2A35' }}
                            />
                            <YAxis
                                yAxisId="power"
                                orientation="left"
                                stroke="#4A4A55"
                                tick={{ fill: '#6B6B75', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 200]}
                                tickFormatter={(value) => `${value}`}
                            />
                            <YAxis
                                yAxisId="soc"
                                orientation="right"
                                stroke="#4A4A55"
                                tick={{ fill: '#6B6B75', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine
                                yAxisId="power"
                                y={avgPower}
                                stroke="#1C69D2"
                                strokeDasharray="5 5"
                                strokeOpacity={0.5}
                            />
                            <Line
                                yAxisId="power"
                                type="monotone"
                                dataKey="power"
                                name="Leistung"
                                stroke="#1C69D2"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: '#1C69D2',
                                    stroke: '#fff',
                                    strokeWidth: 2,
                                }}
                            />
                            <Line
                                yAxisId="soc"
                                type="monotone"
                                dataKey="soc"
                                name="SOC"
                                stroke="#00D68F"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: '#00D68F',
                                    stroke: '#fff',
                                    strokeWidth: 2,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">Warte auf Telemetriedaten...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#2A2A35]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#1C69D2] rounded" />
                    <span className="text-xs text-gray-400">Ladeleistung (kW)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#00D68F] rounded" style={{ borderTop: '2px dashed #00D68F' }} />
                    <span className="text-xs text-gray-400">Ladestand (%)</span>
                </div>
            </div>
        </div>
    );
};

export default LiveChart;
