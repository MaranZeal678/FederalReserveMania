/**
 * MarketDataEngine
 * Ingests real-time or historical data for global assets.
 * For this version, it implements a robust mock with jitter to simulate live markets.
 */
export const fetchMarketData = () => {
    return {
        currencies: {
            "EUR/USD": 1.08 + (Math.random() - 0.5) * 0.01,
            "USD/JPY": 148.5 + (Math.random() - 0.5) * 0.5,
            "GBP/USD": 1.26 + (Math.random() - 0.5) * 0.01,
            "USD/CNY": 7.19 + (Math.random() - 0.5) * 0.02,
        },
        bonds: {
            "US10Y": 4.25 + (Math.random() - 0.5) * 0.1, // Benchmark yield
            "US2Y": 4.60 + (Math.random() - 0.5) * 0.1,
            "AAA_Spread": 0.8 + (Math.random() - 0.5) * 0.05,
        },
        equities: {
            "SP500": 5000 + (Math.random() - 0.5) * 20,
            "NASDAQ": 15800 + (Math.random() - 0.5) * 100,
            "DOW": 38500 + (Math.random() - 0.5) * 50,
            "NIKKEI": 36000 + (Math.random() - 0.5) * 200,
        },
        commodities: {
            "OIL_WTI": 78.5 + (Math.random() - 0.5) * 2,
            "GOLD": 2025 + (Math.random() - 0.5) * 10,
            "COPPER": 3.75 + (Math.random() - 0.5) * 0.05,
        },
        timestamp: new Date().toISOString()
    };
};
