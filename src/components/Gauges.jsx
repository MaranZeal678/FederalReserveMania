import React from 'react';
import { useEconomy } from '../context/EconomyContext';

const Gauge = ({ label, value, unit, target, inverse = false }) => {
    const isGood = inverse ? value <= target : value >= target;
    const color = isGood ? 'var(--up-green)' : 'var(--down-red)';

    return (
        <div className="gauge-card">
            <div className="gauge-label">{label}</div>
            <div className="gauge-value" style={{ color }}>
                {value.toFixed(2)}{unit}
            </div>
            <div className="gauge-label" style={{ fontSize: '0.6rem' }}>Target: {target}{unit}</div>
        </div>
    );
};

const Gauges = () => {
    const { state } = useEconomy();
    if (!state) return null;

    return (
        <div className="gauge-grid">
            <Gauge label="Inflation (CPI)" value={state.inflation * 100} unit="%" target={2} inverse />
            <Gauge label="Unemployment" value={state.unemployment * 100} unit="%" target={4.5} inverse />
            <Gauge label="GDP Growth" value={state.gdp_growth * 100} unit="%" target={2.5} />
        </div>
    );
};

export default Gauges;
