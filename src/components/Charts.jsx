import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useEconomy } from '../context/EconomyContext';

const Charts = () => {
    const { state } = useEconomy();
    if (!state || !state.history) return <div className="panel">Loading Chart Data...</div>;

    // Format data for Recharts (convert to percentage)
    const chartData = state.history.map(d => ({
        ...d,
        gdp_growth: d.gdp_growth * 100,
        inflation: d.inflation * 100,
        unemployment: d.unemployment * 100,
        interest_rate: d.interest_rate * 100,
        taylor_rule_rate: (d.taylor_rule_rate || 0) * 100
    }));

    return (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
            <div style={{ height: '45%' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--bloomberg-amber)', marginBottom: '1rem' }}>Inflation vs Interest Rate (Taylor Rule Overlay)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="tick" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} unit="%" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ fontSize: '10px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="inflation" stroke="var(--down-red)" strokeWidth={2} dot={false} name="Inflation" />
                        <Line type="stepAfter" dataKey="interest_rate" stroke="var(--bloomberg-blue)" strokeWidth={2} dot={false} name="Fed Funds Rate" />
                        <Line type="monotone" dataKey="taylor_rule_rate" stroke="#888" strokeDasharray="5 5" dot={false} name="Taylor Rule" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{ height: '45%' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--bloomberg-amber)', marginBottom: '1rem' }}>GDP Growth & Unemployment</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="tick" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} unit="%" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ fontSize: '10px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="gdp_growth" stroke="var(--up-green)" strokeWidth={2} dot={false} name="GDP Growth" />
                        <Line type="monotone" dataKey="unemployment" stroke="#ff9900" strokeWidth={2} dot={false} name="Unemployment" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;
