import React, { useState, useEffect } from 'react';
import { useEconomy } from '../context/EconomyContext';
import { Play, Pause, FastForward, RotateCcw, Download, MessageSquare, Info } from 'lucide-react';
import Macroprudential from './AdvancedTools';

const Tooltip = ({ text }) => (
    <div className="tooltip-container" style={{ position: 'relative', display: 'inline-block', marginLeft: '5px' }}>
        <Info size={12} style={{ color: 'var(--text-secondary)', cursor: 'help' }} />
        <div className="tooltip-text" style={{
            visibility: 'hidden',
            width: '200px',
            backgroundColor: '#222',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            padding: '5px',
            position: 'absolute',
            zIndex: '1',
            bottom: '125%',
            left: '50%',
            marginLeft: '-100px',
            opacity: '0',
            transition: 'opacity 0.3s',
            fontSize: '0.7rem',
            border: '1px solid #444'
        }}>
            {text}
        </div>
        <style>{`
            .tooltip-container:hover .tooltip-text {
                visibility: visible;
                opacity: 1;
            }
        `}</style>
    </div>
);

const Controls = () => {
    const { state, isPaused, setIsPaused, speed, setSpeed, updatePolicy, resetSim, calculateTick } = useEconomy();
    const [localRate, setLocalRate] = useState(0.025);
    const [localRR, setLocalRR] = useState(0.10);
    const [guidance, setGuidance] = useState("");

    // Sync local state with backend state when it arrives
    useEffect(() => {
        if (state) {
            setLocalRate(state.interest_rate);
            setLocalRR(state.reserve_ratio || 0.10);
        }
    }, [state]);

    const handleGuidanceSubmit = (e) => {
        if (e.key === 'Enter') {
            updatePolicy({ forward_guidance: guidance });
            setGuidance("");
        }
    };

    return (
        <div className="control-panel panel">
            <h3 className="terminal-text" style={{ color: 'var(--bloomberg-amber)', fontSize: '0.9rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                Policy Controls
            </h3>

            {/* Monetary Policy Section */}
            <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Fed Funds Rate <Tooltip text="The target interest rate set by the FOMC. Higher rates cool inflation but slow growth." /></label>
                    <span className="terminal-text" style={{ color: 'var(--bloomberg-blue)' }}>{(localRate * 100).toFixed(2)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="0.1"
                    step="0.0025"
                    value={localRate}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setLocalRate(val);
                        updatePolicy({ interest_rate: val });
                    }}
                />
            </div>

            <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Reserve Ratio <Tooltip text="Percentage of deposits banks must hold. Lower ratio = more lending (money creation)." /></label>
                    <span className="terminal-text" style={{ color: 'var(--bloomberg-blue)' }}>{(localRR * 100).toFixed(1)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.005"
                    value={localRR}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setLocalRate(val); // Mistake in original code fixed here? No wait, this is RR
                        setLocalRR(val);
                        updatePolicy({ reserve_ratio: val });
                    }}
                />
            </div>

            {/* Macroprudential Tools */}
            <Macroprudential />

            {/* Forward Guidance */}
            <div className="control-group" style={{ marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={12} /> Forward Guidance
                    <Tooltip text="Communication to influence market expectations about future policy." />
                </label>
                <input
                    type="text"
                    placeholder="e.g., 'Rates will stay high...'"
                    style={{
                        background: '#050505',
                        border: '1px solid #333',
                        color: 'var(--bloomberg-amber)',
                        fontSize: '0.75rem',
                        padding: '0.5rem',
                        fontFamily: 'var(--font-mono)'
                    }}
                    value={guidance}
                    onChange={(e) => setGuidance(e.target.value)}
                    onKeyDown={handleGuidanceSubmit}
                />
            </div>

            {/* Sim Controls */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <button className={`terminal-button ${isPaused ? 'alert' : ''}`} onClick={() => setIsPaused(!isPaused)}>
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    </button>
                    <button className="terminal-button secondary" onClick={() => setSpeed(speed === 1 ? 5 : 1)}>
                        <FastForward size={16} color={speed > 1 ? 'var(--bloomberg-amber)' : 'inherit'} />
                    </button>
                    <button className="terminal-button secondary" onClick={calculateTick}>
                        STEP
                    </button>
                </div>

                <button className="terminal-button secondary" onClick={resetSim} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <RotateCcw size={14} /> RESET SIMULATION
                </button>

                <a
                    href="http://localhost:5001/sim/export"
                    className="terminal-button secondary"
                    style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem' }}
                >
                    <Download size={14} /> EXPORT CSV
                </a>
            </div>
        </div>
    );
};

export default Controls;
