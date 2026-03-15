import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomicEngine } from './hooks/useEconomicEngine';
import { ASADGraph, PhillipsCurveGraph, MoneyMarketGraph, ForexGraph } from './components/Graphs';
import {
  Play, Pause, FastForward,
  TrendingUp, TrendingDown, Users, DollarSign,
  Activity, Globe, ShieldAlert, Cpu,
  LayoutDashboard, Settings, BarChart3, FileText, Newspaper,
  Lightbulb, AlertTriangle, ChevronRight, History
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthOverlay } from './components/AuthOverlay';


const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ label, value, unit, icon: Icon, color = "text-terminal-bright" }) => (
  <GlassCard className="p-5 flex items-center gap-5 group hover:border-white/20 transition-colors">
    <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-black font-mono flex items-baseline gap-1 ${color} drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]`}>
        {value}<span className="text-xs font-normal opacity-40">{unit}</span>
      </div>
    </div>
  </GlassCard>
);

const Ticker = ({ data }) => (
  <div className="bg-black/80 backdrop-blur-md border-y border-white/5 py-1.5 overflow-hidden whitespace-nowrap z-30">
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "-100%" }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="inline-block"
    >
      {data && [...Object.entries(data.currencies || {}), ...Object.entries(data.equities || {})].map(([key, val]) => (
        <span key={key} className="mx-8 text-[11px] font-mono text-white/50">
          {key}: <span className="text-terminal-bright font-black">{typeof val === 'number' ? val.toFixed(2) : val}</span>
        </span>
      ))}
    </motion.div>
  </div>
);

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'text-terminal-bright' : 'text-white/40 hover:text-white/60'
      }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 w-full h-1 bg-terminal-bright shadow-[0_0_15px_rgba(0,255,65,0.8)]"
      />
    )}
  </button>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('COMMAND');
  const { state, marketData, news, reports, history, hint, benchmarks, aiAdvice, fanChartData, updatePolicy, calculateTick, deployEla, runMonteCarlo } = useEconomicEngine(isPaused, user);

  useEffect(() => {
    if (state && state.tick > 0 && state.tick % 10 === 0) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff41', '#ffffff']
      });
    }
  }, [state?.tick]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAction = (changes, name) => {
    updatePolicy(changes, name);
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => { });
  };

  if (!user) {
    return <AuthOverlay onLogin={(userData) => setUser(userData)} />;
  }

  // Loading State Guard
  if (!state || !hint) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-terminal-bright font-mono">
        <div className="animate-spin-slow mb-4 text-terminal-bright">
          <Cpu size={48} />
        </div>
        <div className="text-xl font-black tracking-widest animate-pulse">
          ESTABLISHING_UPLINK...
        </div>
        <div className="text-xs text-white/40 mt-2">
          Connecting to Central Bank Mainframe via Secure Socket
        </div>
      </div>
    );
  }

  const isGameOver = state.inflation > 0.15 || state.unemployment > 0.20;

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-mono flex flex-col relative overflow-hidden selection:bg-terminal-green selection:text-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terminal-green/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="scanline z-50 pointer-events-none" />

      <header className="flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5 z-40 sticky top-0">
        <div className="flex items-center gap-10 w-full md:w-auto justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col"
          >
            <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-terminal-green/20 rounded-lg border border-terminal-green/30">
                <Cpu className="w-5 h-5 text-terminal-bright animate-spin-slow" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-terminal-bright to-white">
                CENTRAL_BANKER
              </span>
              <span className="text-[10px] text-terminal-bright/60 font-mono tracking-widest mt-1 hidden sm:inline">CRISIS_EDITION</span>
            </div>
          </motion.div>

          {/* Mobile Nav Toggle could go here, for now using wrap */}
        </div>

        <nav className="flex items-center gap-2 mt-4 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <TabButton active={activeTab === 'COMMAND'} icon={LayoutDashboard} label="Terminal" onClick={() => scrollToSection('terminal')} />
          <TabButton active={activeTab === 'POLICY'} icon={Settings} label="Policy" onClick={() => scrollToSection('policy')} />
          <TabButton active={activeTab === 'REPORTS'} icon={History} label="Audit" onClick={() => scrollToSection('audit')} />
          <TabButton active={activeTab === 'BENCHMARKS'} icon={Globe} label="History" onClick={() => scrollToSection('history')} />
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="text-[9px] opacity-30 uppercase font-black">Operator</div>
            <div className="text-[10px] font-black text-terminal-bright">{user.username}</div>
            <button onClick={() => setUser(null)} className="text-[8px] text-white/20 hover:text-red-500 uppercase font-bold">Log_Out</button>
          </div>
        </div>
      </header>

      <Ticker data={marketData} />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">

        {/* Left Side: Advisor & Pulse (Hidden on mobile, visible on lg) */}
        <aside className="hidden lg:flex w-80 flex-col gap-6 p-6 border-r border-white/5 bg-black/20 backdrop-blur-sm h-full overflow-hidden">
          {/* Advisor Content ... (same as before) */}
          <GlassCard className="p-6 border-terminal-bright/20 bg-terminal-bright/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-terminal-green/20 rounded-lg">
                <Lightbulb className="w-4 h-4 text-terminal-bright" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-terminal-bright">Strategic Advisor</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={hint.message}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <div className="text-[10px] font-black text-white/40 uppercase">{hint.source}_V0.8</div>
                <p className="text-sm leading-relaxed text-white/80 italic">"{hint.message}"</p>
                <div className="flex items-center gap-2 pt-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${hint.priority === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-terminal-bright/20 text-terminal-bright'
                    }`}>
                    {hint.priority}_PRIORITY
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          {aiAdvice && (
            <GlassCard className="p-6 border-terminal-bright/20 bg-terminal-bright/[0.02] mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-terminal-green/20 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-terminal-bright" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-terminal-bright">Quant AI Analysis</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-white/80 italic">"{aiAdvice.recommendation}"</p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-terminal-bright/20 text-terminal-bright">
                    CONFIDENCE: {(aiAdvice.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </GlassCard>
          )}


          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
              <Activity className="w-3 h-3" />
              System Pulse
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
              {news.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono opacity-30">{item.timestamp}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.impact === 'POS' ? 'bg-terminal-green/10 text-terminal-bright' : 'bg-red-500/10 text-red-500'
                      }`}>
                      {item.impact}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white/70 group-hover:text-white transition-colors leading-snug">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Tab Content */}
        <div className="flex-1 flex flex-col gap-20 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth pb-32">


          <section id="terminal" className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <LayoutDashboard className="w-5 h-5 text-terminal-bright" />
              <h2 className="text-xl font-black italic tracking-tighter text-white/50">MARKET_TERMINAL</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Nominal GDP" value={(state.m2_supply * 0.05).toFixed(2)} unit="T" icon={Activity} />
              <StatCard label="CPI Inflation" value={(state.inflation * 100).toFixed(2)} unit="%" icon={TrendingUp} color={state.inflation > 0.04 ? "text-red-500" : "text-terminal-bright"} />
              <StatCard label="U-Rate (Labor)" value={(state.unemployment * 100).toFixed(1)} unit="%" icon={Users} color={state.unemployment > 0.07 ? "text-red-500" : "text-terminal-bright"} />
              <StatCard label="Bench Rate" value={(state.interest_rate * 100).toFixed(2)} unit="%" icon={DollarSign} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
              <GlassCard className="p-4 h-[300px]"><ASADGraph state={state} /></GlassCard>
              <GlassCard className="p-4 h-[300px]"><PhillipsCurveGraph state={state} history={history} /></GlassCard>
              <GlassCard className="p-4 h-[300px]"><MoneyMarketGraph state={state} /></GlassCard>
              <GlassCard className="p-4 h-[300px]"><ForexGraph marketData={marketData} /></GlassCard>
            </div>
          </section>

          <section id="policy" className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <Settings className="w-5 h-5 text-terminal-bright" />
              <h2 className="text-xl font-black italic tracking-tighter text-white/50">POLICY_CONTROLS</h2>
            </div>

            <GlassCard className="p-10 w-full space-y-12 mb-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black italic tracking-tighter">Monetary_Transmission.sh</h2>
                <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span className="text-[10px] font-black uppercase">Friction Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Interest Rate</span>
                    <span className="text-white opacity-100">{(state.interest_rate * 100).toFixed(2)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="0.10" step="0.0025"
                    value={state.interest_rate}
                    onChange={(e) => handleAction({ interest_rate: parseFloat(e.target.value) }, 'ADJUST_RATE')}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-terminal-bright"
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Reserve Requirement</span>
                    <span className="text-white opacity-100">{Math.round((state.reserve_ratio || 0.1) * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.50" step="0.005"
                    value={state.reserve_ratio || 0.1}
                    onChange={(e) => handleAction({ reserve_ratio: parseFloat(e.target.value) }, 'ADJUST_RR')}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-terminal-bright"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-6 border-t border-white/5">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>CCyB (Capital Buffer)</span>
                    <span className="text-white opacity-100">{(state.ccyb * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="0.05" step="0.005"
                    value={state.ccyb}
                    onChange={(e) => handleAction({ ccyb: parseFloat(e.target.value) }, 'ADJUST_CCYB')}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-terminal-bright"
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>LTV Cap (Lending Restraint)</span>
                    <span className="text-white opacity-100">{(state.ltv_cap * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range" min="0.5" max="1.0" step="0.05"
                    value={state.ltv_cap}
                    onChange={(e) => handleAction({ ltv_cap: parseFloat(e.target.value) }, 'ADJUST_LTV')}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-terminal-bright"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">
                  <span>Forward Guidance (Speech Syntax)</span>
                </div>
                <select
                  onChange={(e) => handleAction({ forward_guidance: e.target.value }, 'FORWARD_GUIDANCE')}
                  className="w-full bg-white/5 text-white/80 p-3 rounded-lg border border-white/10 appearance-none font-mono text-sm"
                  defaultValue="NEUTRAL"
                >
                  <option value="Select Stance" disabled>Select Comm Stance</option>
                  <option value="Hawkish: We will act forcefully to contain inflation.">Hawkish (Tighten Conditions)</option>
                  <option value="Dovish: We stand ready to support the economy.">Dovish (Loosen Conditions)</option>
                  <option value="Neutral: Data dependent approach.">Neutral (Wait & See)</option>
                </select>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction({ qe_qt: 100 }, 'EXPANSION_OMO')}
                  className="p-6 bg-terminal-bright text-black font-black uppercase rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  <span>Open Market Buy</span>
                  <ChevronRight />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction({ qe_qt: -100 }, 'CONTRACTION_OMO')}
                  className="p-6 bg-red-600 text-white font-black uppercase rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <span>Open Market Sell</span>
                  <ChevronRight />
                </motion.button>
              </div>
              <div className="pt-6 grid grid-cols-1 gap-6 border-t border-white/5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => deployEla()}
                  className="p-6 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-black uppercase rounded-2xl flex items-center justify-center gap-4 hover:bg-yellow-500 hover:text-black transition-colors shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                >
                  <ShieldAlert className="w-6 h-6" />
                  <span>Deploy Emergency Liquidity Assistance (ELA)</span>
                </motion.button>
              </div>
            </GlassCard>

            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 mt-8">
              <Cpu className="w-5 h-5 text-terminal-bright" />
              <h2 className="text-xl font-black italic tracking-tighter text-white/50">QUANT_ALGORITHMS & INDICATORS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                label="Taylor Rule Target"
                value={(state.taylor_rule_rate * 100).toFixed(2)}
                unit="%"
                icon={Cpu}
                color={Math.abs(state.taylor_rule_rate - state.interest_rate) > 0.01 ? "text-yellow-500" : "text-terminal-bright"}
              />
              <StatCard
                label="Financial Stress"
                value={state.stress_index.toFixed(2)}
                unit="Idx"
                icon={Activity}
                color={state.stress_index > 1.5 ? "text-red-500" : "text-terminal-bright"}
              />
              <StatCard
                label="Yield Spread (10Y-2Y)"
                value={(state.yield_spread * 100).toFixed(2)}
                unit="bps"
                icon={BarChart3}
                color={state.yield_spread < 0 ? "text-red-500" : "text-terminal-bright"}
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={runMonteCarlo}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded transition-colors border border-white/10 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Run Monte Carlo Simulation
              </button>
            </div>
            {fanChartData && (
              <GlassCard className="p-6 w-full text-xs font-mono text-white/60 mb-8">
                <h3 className="text-sm font-black text-white/90 mb-2">Simulation Complete</h3>
                <p>Generated {fanChartData.inflation.length} paths for 24-month horizon.</p>
                {/* In a real app, you would pass fanChartData to a fan chart component here */}
                <div className="mt-4 p-4 border border-white/10 bg-white/5 text-center">
                  [ Fan Chart Data Acquired - Ready for Visualization ]
                </div>
              </GlassCard>
            )}

          </section>

          <section id="audit" className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <History className="w-5 h-5 text-terminal-bright" />
              <h2 className="text-xl font-black italic tracking-tighter text-white/50">AUDIT_LOGS</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reports.slice(0, 5).map((report, idx) => (
                <GlassCard key={report.id} className="p-6 grid grid-cols-4 gap-8 items-center bg-white/[0.01]">
                  <div>
                    <div className="text-[10px] font-black text-white/30 uppercase mb-2">Transmission Event</div>
                    <div className="text-lg font-black italic">{report.action}</div>
                    <div className="text-[10px] text-terminal-bright opacity-60">TICK_{report.tick} // COMPLETE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black text-white/30 uppercase mb-2">GDP Vector</div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs opacity-30">${(report.before.m2_supply * 0.05).toFixed(2)}</span>
                      <ChevronRight size={14} className="opacity-20" />
                      <span className="text-sm font-black text-terminal-bright">${(report.after.m2_supply * 0.05).toFixed(2)}T</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black text-white/30 uppercase mb-2">Inflation Vector</div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs opacity-30">{(report.before.inflation * 100).toFixed(1)}%</span>
                      <ChevronRight size={14} className="opacity-20" />
                      <span className={`text-sm font-black ${report.after.inflation > 0.04 ? 'text-red-500' : 'text-terminal-bright'}`}>{(report.after.inflation * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/40 mb-2 uppercase">{report.timestamp}</div>
                    <div className="text-[9px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded uppercase inline-block">Audit Passed</div>
                  </div>
                </GlassCard>
              ))}
              {reports.length === 0 && (
                <div className="p-10 flex flex-col items-center justify-center opacity-20 border border-white/10 rounded-2xl border-dashed">
                  <FileText size={48} className="mb-4" />
                  <div className="text-xl font-black uppercase tracking-[0.5em]">No Log History</div>
                </div>
              )}
            </div>
          </section>

          <section id="history" className="flex flex-col gap-6 pb-20">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <Globe className="w-5 h-5 text-terminal-bright" />
              <h2 className="text-xl font-black italic tracking-tighter text-white/50">HISTORICAL_BENCHMARKS</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/10">
                    <th className="py-4 pl-4">Year</th>
                    <th className="py-4">Economic Context</th>
                    <th className="py-4 text-right">GDP %</th>
                    <th className="py-4 text-right">CPI %</th>
                    <th className="py-4 text-right">U-Rate</th>
                    <th className="py-4 text-right pr-4">Fed Funds</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {benchmarks && benchmarks.map((b) => (
                    <tr key={b.year} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 pl-4 font-black text-terminal-bright">{b.year}</td>
                      <td className="py-4 text-white/60 italic">"{b.event}"</td>
                      <td className={`py-4 text-right font-black ${b.gdp > 0 ? 'text-terminal-bright' : 'text-red-500'}`}>{b.gdp > 0 ? '+' : ''}{(b.gdp * 100).toFixed(1)}%</td>
                      <td className={`py-4 text-right font-black ${b.inflation > 0.04 ? 'text-red-500' : 'text-white/60'}`}>{(b.inflation * 100).toFixed(1)}%</td>
                      <td className="py-4 text-right text-white/60">{(b.unemployment * 100).toFixed(1)}%</td>
                      <td className="py-4 text-right text-white/60 pr-4">{(b.rate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Extreme Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-20 border-2 border-red-500/50 bg-black max-w-4xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
              <ShieldAlert size={100} className="mx-auto text-red-500 mb-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
              <h1 className="text-7xl font-black text-red-500 mb-4 tracking-tighter">ECONOMIC_RUIN</h1>
              <p className="text-xl text-white/40 mb-16 uppercase tracking-[0.4em] font-light">Mandate Violation: {state.inflation > 0.15 ? 'Hyperinflationary Spiral' : 'Structural Depression Failure'}</p>

              <div className="grid grid-cols-3 gap-12 mb-16 text-left">
                <div className="border-l border-red-500/30 pl-6">
                  <div className="text-[10px] opacity-30 uppercase font-black mb-2">Final Approval</div>
                  <div className="text-3xl font-black text-white">{state.approvalRating ? state.approvalRating.toFixed(1) : "0.0"}%</div>
                </div>
                <div className="border-l border-red-500/30 pl-6">
                  <div className="text-[10px] opacity-30 uppercase font-black mb-2">Misery Index</div>
                  <div className="text-3xl font-black text-white">{(state.inflation * 100 + state.unemployment * 100).toFixed(1)}</div>
                </div>
                <div className="border-l border-red-500/30 pl-6">
                  <div className="text-[10px] opacity-30 uppercase font-black mb-2">Market Stability</div>
                  <div className="text-3xl font-black text-red-500">FAILED</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="w-full py-6 bg-red-600 text-black font-black uppercase tracking-[0.8em] transition-all shadow-[0_0_50px_rgba(239,68,68,0.4)]"
              >
                REBOOT_SYSTEM
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full md:w-auto px-4 md:px-0">
        <GlassCard className="flex items-center gap-4 md:gap-8 px-6 py-4 bg-black/80 backdrop-blur-xl border-terminal-green/30 shadow-[0_0_50px_rgba(0,255,65,0.15)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-4 rounded-full transition-all ${!isPaused ? 'bg-terminal-bright text-black shadow-[0_0_20px_rgba(0,255,65,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
            </button>
            <button onClick={calculateTick} className="p-3 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <FastForward size={20} />
            </button>
          </div>

          <div className="h-10 w-[1px] bg-white/10" />

          <div className="flex flex-col">
            <div className="text-[9px] uppercase font-black text-white/30 tracking-widest">Simulation_State</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${!isPaused ? 'bg-terminal-bright animate-pulse' : 'bg-red-500'}`} />
              <span className="font-mono font-black text-sm">{!isPaused ? 'RUNNING_ALGORITHM' : 'SYSTEM_PAUSED'}</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-[9px] uppercase font-black text-white/30 tracking-widest">Tick_Sequence</div>
            <div className="font-mono font-black text-xl text-terminal-bright">{state.tick}</div>
          </div>
        </GlassCard>
      </div>

      <footer className="px-8 py-3 bg-black/40 border-t border-white/5 backdrop-blur-2xl flex justify-between items-center z-40 hidden md:flex">
        <div className="flex gap-10">
          <div className="flex items-center gap-2 text-[10px] text-terminal-bright font-black uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-bright animate-pulse" />
            Node: Washington_DC
          </div>
          <div className="text-[10px] text-white/40 uppercase font-black">Tick_Sequence: {state.tick}</div>
        </div>
        <div className="flex gap-8 text-[10px] text-white/20 uppercase font-bold">
          <span>Markets: Volatile</span>
          <span>Security: High</span>
          <span>Auth: FED_CHAIR_USER</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 20px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 100;
          background-size: 100% 4px, 3px 100%;
          pointer-events: none;
        }
      `}} />
    </div >
  );
}
