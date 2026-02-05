import { motion, AnimatePresence } from 'framer-motion';
import {
    Battery,
    Settings,
    Bell,
    RefreshCw,
    Pause,
    Play,
    Database,
    ChevronRight
} from 'lucide-react';

interface HeaderProps {
    vehicleName: string;
    batteryPackId: string;
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
    isSimulating: boolean;
    onToggleSimulation: () => void;
    onReset: () => void;
    onExport: () => void;
    lastUpdated: Date;
}

const Header: React.FC<HeaderProps> = ({
    vehicleName,
    batteryPackId,
    connectionStatus,
    isSimulating,
    onToggleSimulation,
    onReset,
    onExport,
    lastUpdated,
}) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'connected':
                return { color: '#00D68F', text: 'Live Telemetrie', pulse: true };
            case 'reconnecting':
                return { color: '#FFAA00', text: 'Verbinde...', pulse: true };
            default:
                return { color: '#FF3D71', text: 'Offline', pulse: false };
        }
    };

    const statusConfig = getStatusConfig(connectionStatus);

    return (
        <header className="w-full bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-[1920px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo & Title Section */}
                    <div className="flex items-center gap-6">
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1C69D2] via-[#3D8BF2] to-[#1C69D2] p-[2px] shadow-[0_0_20px_rgba(28,105,210,0.4)]">
                                <div className="w-full h-full rounded-full bg-[#0A0A0F] flex items-center justify-center">
                                    <Battery className="w-7 h-7 text-[#1C69D2]" />
                                </div>
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-full bg-[#1C69D2]/20 blur-xl"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
                                    BMW <span className="text-[#1C69D2] not-italic">i</span>-Storage
                                </h1>
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                    Performance v2.1
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 font-medium">
                                <span className="text-sm text-gray-400">{vehicleName}</span>
                                <ChevronRight className="w-3 h-3 text-gray-700" />
                                <span className="text-xs text-[#1C69D2] font-mono tracking-wider">{batteryPackId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Central Live Status */}
                    <motion.div
                        className="hidden xl:flex items-center gap-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Connection</span>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: statusConfig.color }}
                                    animate={statusConfig.pulse ? { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-sm font-semibold text-white tracking-wide">{statusConfig.text}</span>
                            </div>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Last Frame</span>
                            <span className="text-sm font-mono text-gray-300 font-bold tracking-widest">
                                {lastUpdated.toLocaleTimeString('de-DE')}
                            </span>
                        </div>
                    </motion.div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3">
                        {/* Simulation Toggle - Premium Design */}
                        <motion.button
                            className={`group relative flex items-center gap-3 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all overflow-hidden ${isSimulating
                                    ? 'text-white'
                                    : 'text-gray-400 border border-white/10 hover:border-white/20 bg-white/5'
                                }`}
                            onClick={onToggleSimulation}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSimulating && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[#1C69D2] via-[#3D8BF2] to-[#1C69D2] bg-[length:200%_auto]"
                                    animate={{ backgroundPosition: ["0% center", "200% center"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                            )}
                            <div className="relative flex items-center gap-2">
                                {isSimulating ? (
                                    <>
                                        <Pause className="w-4 h-4 fill-white" />
                                        <span>LIVE DATA ON</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-gray-400" />
                                        <span>START ENGINE</span>
                                    </>
                                )}
                            </div>
                        </motion.button>

                        {/* Export Button - High Tech Design */}
                        <motion.button
                            className="group relative flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#00D68F]/10 border border-[#00D68F]/30 hover:bg-[#00D68F]/20 hover:border-[#00D68F]/50 transition-all font-bold text-[#00D68F] text-xs tracking-widest uppercase overflow-hidden"
                            onClick={onExport}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-700 pointer-events-none" />
                            <Database className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Analytics</span>
                        </motion.button>

                        <div className="w-[1px] h-8 bg-white/10 mx-2 hidden sm:block" />

                        {/* System Controls */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                                onClick={onReset}
                                whileHover={{ rotate: 180 }}
                                title="Reset Simulation"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </motion.button>

                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF3D71] rounded-full border-2 border-[#0A0A0F]" />
                            </button>

                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
