import { motion } from 'framer-motion';
import { useBatterySimulation } from './hooks/useBatterySimulation';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import BatteryGauge from './components/BatteryGauge';
import LiveChart from './components/LiveChart';
import HealthMonitor from './components/HealthMonitor';
import RangePredictor from './components/RangePredictor';
import CellGrid from './components/CellGrid';
import { ShieldAlert, Zap, Thermometer, Database } from 'lucide-react';
import './App.css';

function App() {
  const {
    batteryStatus,
    chartData,
    isSimulating,
    toggleSimulation,
    resetSimulation,
    exportTelemetry,
  } = useBatterySimulation(2000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#121218] to-[#0A0A0F]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1C69D2]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1C69D2]/5 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <Header
        vehicleName={batteryStatus.modelName}
        batteryPackId={batteryStatus.batteryPackId}
        connectionStatus={batteryStatus.connectionStatus}
        isSimulating={isSimulating}
        onToggleSimulation={toggleSimulation}
        onReset={resetSimulation}
        onExport={exportTelemetry}
        lastUpdated={batteryStatus.lastUpdated}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-[1920px] mx-auto">
        <motion.div
          className="dashboard-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Bar */}
          <StatsBar batteryStatus={batteryStatus} />

          {/* Main Row - Battery Gauge + Live Chart */}
          <BatteryGauge
            soc={batteryStatus.soc}
            temperature={batteryStatus.temperature}
            voltage={batteryStatus.voltage}
            charging={batteryStatus.charging}
          />

          <LiveChart data={chartData} isSimulating={isSimulating} />

          {/* Secondary Row - Health Monitor + Range Predictor + Cell Grid */}
          <HealthMonitor
            soh={batteryStatus.soh}
            voltage={batteryStatus.voltage}
            warnings={batteryStatus.warnings}
          />

          <RangePredictor
            range={batteryStatus.range}
            soc={batteryStatus.soc}
          />

          <CellGrid voltage={batteryStatus.voltage} />

          {/* Diagnostic Engineering Panel (BMW Specific) */}
          <motion.div
            className="glass-card p-6 col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#1C69D2]" />
                State of Power (SOP)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Max Discharge</p>
                  <p className="text-lg font-bold text-white tracking-tighter">{batteryStatus.sop.maxDischargePower.toFixed(0)} kW</p>
                </div>
                <div className="p-3 bg-black/40 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase">Max Charge</p>
                  <p className="text-lg font-bold text-white tracking-tighter">{batteryStatus.sop.maxChargePower.toFixed(0)} kW</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#FF3D71]" />
                Thermal Safety
              </h3>
              <div className="p-3 bg-black/40 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Thermal Limit</p>
                  <p className="text-lg font-bold text-white tracking-tighter">{batteryStatus.sop.thermalLimit}%</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${batteryStatus.temperature.thermalRunawayRisk === 'low' ? 'bg-green-500/20 text-green-400' :
                  batteryStatus.temperature.thermalRunawayRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                  RISK: {batteryStatus.temperature.thermalRunawayRisk.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00D68F]" />
                Data Analysis Bridge
              </h3>
              <div className="p-3 bg-[#00D68F]/5 border border-[#00D68F]/10 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Bereit für Python-Integration (Jupyter/Pandas)</p>
                <motion.button
                  onClick={exportTelemetry}
                  className="w-full py-3 bg-gradient-to-r from-[#00D68F]/20 to-[#00D68F]/10 border border-[#00D68F]/30 text-[#00D68F] text-xs font-black tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,214,143,0.2)] transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  TELEMETRIE EXPORTIEREN (.JSON)
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="px-6 py-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
              <span>V2.1.0-Engineering-Release</span>
              <span>•</span>
              <span>Ready for BMW Data Analytics</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              BMW i-Battery Performance Dashboard • Hiring Project Demo
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}

export default App;
