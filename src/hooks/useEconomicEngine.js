import { useState, useCallback, useEffect } from 'react';
import { fetchMarketData } from '../services/MarketDataEngine';
import { generateHeadline } from '../services/NewsEngine';
import { getAdvisorHint } from '../services/AdvisorEngine';

const API_BASE = 'http://localhost:5001/sim';

export const useEconomicEngine = (isPaused = true, user = null) => {
    const [state, setState] = useState(null); // Initial state is null until fetched
    const [marketData, setMarketData] = useState(fetchMarketData());
    const [news, setNews] = useState([]);
    const [reports, setReports] = useState([]);
    const [history, setHistory] = useState([]);
    const [recentAction, setRecentAction] = useState(null);
    const [hint, setHint] = useState({ message: "System Initialized. Awaiting Input.", source: "SYSTEM", priority: "LOW" });
    const [fanChartData, setFanChartData] = useState(null);
    const [aiAdvice, setAiAdvice] = useState(null);

    const [benchmarks, setBenchmarks] = useState([]);

    // Initial Fetch
    useEffect(() => {
        fetchState();
        fetchBenchmarks();
        fetchReports();
    }, []);

    const fetchState = async () => {
        try {
            const res = await fetch(`${API_BASE}/state`);
            const data = await res.json();
            setState(data);
            if (data.history) setHistory(data.history);
        } catch (err) {
            console.error("Failed to fetch simulation state", err);
        }
    };

    const fetchBenchmarks = async () => {
        try {
            const res = await fetch(`http://localhost:5001/data/historical`);
            const data = await res.json();
            setBenchmarks(data);
        } catch (err) {
            console.error("Failed to fetch benchmarks", err);
        }
    };

    const calculateTick = useCallback(async () => {
        if (isPaused) return;
        try {
            const res = await fetch(`${API_BASE}/tick`, { method: 'POST' });
            const newState = await res.json();

            setState(newState);
            setHistory(newState.history || []);
            setMarketData(fetchMarketData()); // Keep local for now, but should ideally come from backend too

            // Generate news based on new state
            if (newState.tick % 5 === 0) { // Every 5 ticks
                setNews(n => [generateHeadline(newState, recentAction), ...n].slice(0, 15));
                setRecentAction(null);
            }

            // Update Advisor Hint
            if (newState.tick % 3 === 0) {
                setHint(getAdvisorHint({
                    gdp: newState.gdp_growth * 100, // convert back to readable percentages for engine
                    gdpPotential: 2.5, // matches POTENTIAL_GDP_GROWTH in engine.py
                    inflation: newState.inflation * 100,
                    unemployment: newState.unemployment * 100,
                    interestRateNominal: newState.interest_rate * 100
                }));
            }

            // Fetch AI Advice periodically
            if (newState.tick % 10 === 0) {
                fetchAiAdvice();
            }

        } catch (err) {
            console.error("Tick failed", err);
        }
    }, [isPaused, recentAction]);

    const updatePolicy = async (changes) => {
        try {
            const res = await fetch(`${API_BASE}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changes)
            });
            const newState = await res.json();

            // Log the action
            const actionName = Object.keys(changes)[0].toUpperCase().replace('_', ' ');
            await fetch('http://localhost:5001/data/log_action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user ? user.id : 1, // Default ID if no user
                    tick: newState.tick,
                    action: actionName,
                    before: state,
                    after: newState
                })
            });

            setState(newState);
            fetchReports(); // Refresh logs

            // Identify action for news
            if (changes.interest_rate) setRecentAction("Rate Change");
            if (changes.reserve_ratio) setRecentAction("Reserve Ratio Change");
            if (changes.forward_guidance) setRecentAction("Forward Guidance");

        } catch (err) {
            console.error("Policy update failed", err);
        }
    };

    const fetchReports = async () => {
        try {
            const res = await fetch('http://localhost:5001/data/logs');
            const data = await res.json();
            setReports(data);
        } catch (err) { console.error("Failed to fetch reports", err); }
    };

    const fetchAiAdvice = async () => {
        try {
            const res = await fetch(`${API_BASE}/ai_advice`);
            const data = await res.json();
            setAiAdvice(data);
        } catch (e) { console.error(e); }
    };

    const runMonteCarlo = async () => {
        try {
            const res = await fetch(`${API_BASE}/monte_carlo`);
            const data = await res.json();
            setFanChartData(data);
        } catch (e) { console.error(e); }
    };

    const deployEla = async () => {
        try {
            const res = await fetch(`${API_BASE}/ela`, { method: 'POST' });
            const newState = await res.json();
            setState(newState);
            setRecentAction("Emergency Liquidity");
        } catch (e) { console.error(e); }
    };

    const resetSim = async () => {
        try {
            const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
            const newState = await res.json();
            setState(newState);
            setHistory([]);
            setNews([]);
        } catch (e) { console.error(e); }
    };

    // Polling Loop for Ticks
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(calculateTick, 2000); // 2 seconds per tick
        return () => clearInterval(interval);
    }, [isPaused, calculateTick]);

    return {
        state,
        marketData,
        news,
        reports,
        history,
        hint,
        benchmarks,
        aiAdvice,
        fanChartData,
        updatePolicy,
        deployEla,
        runMonteCarlo,
        resetSim,
        calculateTick
    };
};
