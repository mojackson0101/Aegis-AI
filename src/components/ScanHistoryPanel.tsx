import React from 'react';
import { ScanResult } from '../types';
import { 
  History, 
  Trash2, 
  Clock, 
  Globe, 
  X,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Timer
} from 'lucide-react';

interface ScanHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scans: ScanResult[];
  activeScanId: string | null;
  onSelectScan: (scan: ScanResult) => void;
  onDeleteScan: (scanId: string) => Promise<void>;
  onNewScanClick: () => void;
}

export const ScanHistoryPanel: React.FC<ScanHistoryPanelProps> = ({
  isOpen,
  onClose,
  scans,
  activeScanId,
  onSelectScan,
  onDeleteScan,
  onNewScanClick,
}) => {
  if (!isOpen) return null;

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 75) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (score >= 60) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 rounded-xl text-cyan-400 border border-slate-700">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Past Assessments
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {scans.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Toggle between previous penetration tests</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action */}
          <div className="p-3 bg-slate-900/80 border-b border-slate-800">
            <button
              onClick={() => {
                onClose();
                onNewScanClick();
              }}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch New Assessment</span>
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
            {scans.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <History className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">No past scan records yet.</p>
                <p className="text-xs text-slate-500">Run a pentest on a target to create history.</p>
              </div>
            ) : (
              scans.map((item) => {
                const isActive = item.scanId === activeScanId;
                const formattedDate = new Date(item.scannedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.scanId}
                    onClick={() => {
                      onSelectScan(item);
                      onClose();
                    }}
                    className={`group relative rounded-xl p-3.5 border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-bold text-white text-xs sm:text-sm truncate font-mono">
                          {item.target.domain}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getScoreBadge(
                            item.securityScore
                          )}`}
                        >
                          {item.securityScore}/100 • {item.riskGrade}
                        </span>

                        <button
                          title="Delete assessment"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteScan(item.scanId);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* URL */}
                    <p className="text-[11px] text-slate-400 font-mono truncate mb-2">
                      {item.target.normalizedUrl}
                    </p>

                    {/* Metrics row */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        {item.scanDurationMs && (
                          <>
                            <span className="text-cyan-400 flex items-center gap-0.5" title="Assessment Duration">
                              <Timer className="w-3 h-3 text-cyan-400" />
                              {(item.scanDurationMs / 1000).toFixed(2)}s
                            </span>
                            <span className="text-slate-600">•</span>
                          </>
                        )}
                        <span className="text-rose-400">{item.stats.critical + item.stats.high} High/Crit</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-400">{item.stats.resolved}/{item.stats.total} Patched</span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center text-xs text-slate-500 font-mono">
            Aegis AI Memory Ledger
          </div>
        </div>
      </div>
    </div>
  );
};
