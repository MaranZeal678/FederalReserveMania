import React from 'react';
import { useEconomy } from '../context/EconomyContext';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const FinancialMarkets = () => {
    const { state } = useEconomy();
    if (!state) return null;

    const spread = state.yield_spread || 0;
    const isInverted = spread < 0;

    return (
        <div className="panel" style={{ borderTop: '1px solid #333', marginTop: '1rem', paddingTop: '1rem' }}>
            <h3 className="terminal-text" style={{ color: 'var(--bloomberg-amber)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={14} /> Market Indicators
            </h3>

            <div className="gauge-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="gauge-card" style={{ padding: '0.5rem' }}>
                    <div className="gauge-label">S&P 500</div>
                    <div className="gauge-value" style={{ fontSize: '1.2rem' }}>
                        {state.sp500.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                </div>

                <div className="gauge-card" style={{ padding: '0.5rem', border: isInverted ? '1px solid var(--down-red)' : '1px solid #333' }}>
                    <div className="gauge-label">10Y-2Y Spread</div>
                    <div className="gauge-value" style={{ fontSize: '1.2rem', color: isInverted ? 'var(--down-red)' : 'var(--up-green)' }}>
                        {(spread * 100).toFixed(2)}%
                    </div>
                    {isInverted && <div style={{ fontSize: '0.5rem', color: 'var(--down-red)', fontWeight: 'bold' }}>CURVE INVERTED</div>}
                </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <DollarSign size={12} /> DXY: {state.exchange_rate.toFixed(1)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: state.net_exports >= 0 ? 'var(--up-green)' : 'var(--down-red)' }}>
                    {state.net_exports >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    Net X: {state.net_exports}
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.3rem' }}>FINANCIAL STRESS INDEX</div>
                <div style={{ height: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, state.stress_index * 20)}%`,
                        background: state.stress_index > 3 ? 'var(--down-red)' : state.stress_index > 1.5 ? 'var(--bloomberg-amber)' : 'var(--up-green)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default FinancialMarkets;
