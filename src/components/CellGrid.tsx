import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Info } from 'lucide-react';
import type { VoltageData } from '../types/battery';

interface CellGridProps {
    voltage: VoltageData;
}

const CellGrid: React.FC<CellGridProps> = ({ voltage }) => {
    // Generieren von 96 Zellen basierend auf der Durchschnittsspannung und Varianz
    const cells = useMemo(() => {
        const avgCellVoltage = voltage.packVoltage / voltage.cellCount;
        return Array.from({ length: voltage.cellCount }).map((_, i) => {
            // Simulierte leichte Abweichung pro Zelle
            const variance = (Math.random() - 0.5) * (voltage.cellVariance / 500);
            return {
                id: i,
                v: avgCellVoltage + variance
            };
        });
    }, [voltage.packVoltage, voltage.cellCount, voltage.cellVariance]);

    return (
        <div className="glass-card glass-card-hover p-6 col-span-12 lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00D68F]/20 flex items-center justify-center">
                        <Grid3X3 className="w-5 h-5 text-[#00D68F]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Zell-Matrix</h2>
                        <p className="text-sm text-gray-400">Einzelzell-Spannungen (96S)</p>
                    </div>
                </div>
                <div className="group relative">
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-black/90 text-[10px] text-gray-400 rounded border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        Echtzeit-Überwachung der 96 seriell verschalteten Batteriezellen.
                        Farbe indiziert Spannungsabweichung.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-1 mb-4">
                {cells.map((cell) => {
                    // Bestimme Farbe basierend auf Abweichung zur Durchschnittsspannung
                    const avg = voltage.packVoltage / voltage.cellCount;
                    const diff = Math.abs(cell.v - avg);
                    let color = "bg-blue-500/40";
                    if (diff > 0.05) color = "bg-yellow-500/60";
                    if (diff > 0.1) color = "bg-red-500/80";

                    return (
                        <motion.div
                            key={cell.id}
                            className={`h-2 rounded-[1px] ${color}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: cell.id * 0.005 }}
                            title={`Zelle ${cell.id + 1}: ${cell.v.toFixed(3)}V`}
                        />
                    );
                })}
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase tracking-wider border-t border-gray-800/50 pt-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                    <span>Nominal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span>Abweichung</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span>Kritisch</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CellGrid);
