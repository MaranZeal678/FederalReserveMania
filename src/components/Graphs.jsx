import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ReferenceLine, ScatterChart, Scatter, Cell, Label
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-white/10 p-3 rounded-lg backdrop-blur-xl shadow-2xl">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">{label}</p>
                <p className="text-sm font-black text-terminal-bright">
                    VALUE: {payload[0].value.toFixed(2)}
                </p>
            </div>
        );
    }
    return null;
};

const GraphContainer = ({ title, children }) => (
    <div className="w-full h-full flex flex-col p-2">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{title}</h3>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-terminal-bright/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-terminal-bright/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-terminal-bright/60" />
            </div>
        </div>
        <div className="flex-1 min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    </div>
);

export const ASADGraph = ({ state }) => {
    // Mock AD/AS using gdp_growth and inflation
    // state.gdp_growth is around 0.02 (2%). We scale it to be around 20 for the graph.
    const gdp = (state.gdp_growth || 0.02) * 1000;
    const pl = (state.inflation || 0.02) * 1000;

    const data = [
        { x: 10, as: 10, ad: 30 },
        { x: 20 + (gdp - 20), as: 20 + (pl - 20), ad: 20 + (pl - 20) }, // illustrative center point
        { x: 30, as: 30, ad: 10 },
    ];

    return (
        <GraphContainer title="AD / AS_MODEL_V2">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorAD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff41" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="x" hide type="number" domain={[0, 40]} />
                <YAxis hide type="number" domain={[0, 40]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ad" stroke="#00ff41" strokeWidth={3} fillOpacity={1} fill="url(#colorAD)" isAnimationActive={true} />
                <Line type="monotone" dataKey="as" stroke="#fff" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <ReferenceLine x={20} stroke="#444" strokeWidth={1}>
                    <Label value="LRAS" position="top" fill="#444" fontSize={10} fontStyle="bold" />
                </ReferenceLine>
                <ReferenceLine x={20 + (gdp - 20)} stroke="#00ff41" strokeDasharray="3 3" />
            </AreaChart>
        </GraphContainer>
    );
};

export const PhillipsCurveGraph = ({ state, history }) => {
    const plotData = history.map(h => ({ u: h.unemployment * 100, i: h.inflation * 100 }));

    return (
        <GraphContainer title="PHILLIPS_CURVE_FLUX">
            <ScatterChart>
                <CartesianGrid stroke="#ffffff05" vertical={false} />
                <XAxis type="number" dataKey="u" hide domain={[0, 15]} />
                <YAxis type="number" dataKey="i" hide domain={[-2, 12]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Economy State" data={plotData} fill="#00ff41">
                    {plotData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fillOpacity={index / plotData.length} />
                    ))}
                </Scatter>
                <ReferenceLine x={5} stroke="#fff" strokeOpacity={0.1} label={{ value: 'NRU', position: 'insideBottomRight', fill: '#fff', fontSize: 10, opacity: 0.2 }} />
            </ScatterChart>
        </GraphContainer>
    );
};

export const MoneyMarketGraph = ({ state }) => {
    // state.m2_supply is likely around 20000.
    const ms = state.m2_supply || 20000;
    const rate = (state.interest_rate || 0.025) * 100;

    // Create dummy curves crossing at (ms, rate)
    // MS is vertical line at ms. 
    // MD is downward sloping.
    const data = [
        { rate: rate + 5, md: ms - 1000 },
        { rate: rate, md: ms },
        { rate: rate - 5, md: ms + 1000 },
    ];

    return (
        <GraphContainer title="LIQUIDITY_PREFERENCE">
            <LineChart data={data}>
                <CartesianGrid stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="md" hide type="number" domain={['auto', 'auto']} />
                <YAxis dataKey="rate" hide type="number" domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rate" stroke="#00ff41" strokeWidth={3} dot={false} />
                <ReferenceLine x={ms} stroke="#fff" strokeWidth={2}>
                    <Label value="MS" position="top" fill="#fff" fontSize={10} />
                </ReferenceLine>
            </LineChart>
        </GraphContainer>
    );
};

export const ForexGraph = ({ marketData }) => {
    if (!marketData || !marketData.currencies) return null;

    const data = [
        { name: 'USD/JPY', val: marketData.currencies["USD/JPY"] },
        { name: 'EUR/USD', val: marketData.currencies["EUR/USD"] },
        { name: 'GBP/USD', val: marketData.currencies["GBP/USD"] },
    ];

    return (
        <GraphContainer title="EXT_VALUATION_DESK">
            <AreaChart data={data}>
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="step" dataKey="val" stroke="#00ff41" fill="#00ff410a" strokeWidth={2} />
            </AreaChart>
        </GraphContainer>
    );
};
