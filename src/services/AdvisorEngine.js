/**
 * AdvisorEngine
 * Analyzes the current economic state and provides AP-Macro based hints.
 * Simulates institutional advice for "Conservative Institutions".
 */
export const getAdvisorHint = (state) => {
    const { gdp, gdpPotential, inflation, unemployment, interestRateNominal } = state;
    const gdpGap = ((gdp - gdpPotential) / gdpPotential) * 100;

    if (inflation > 10) {
        return {
            source: "Chief Economist",
            message: "Hyperinflation alert! We must tighten the money supply immediately. Raise the Discount Rate and sell bonds to drain liquidity.",
            priority: "CRITICAL",
            action: "CONTRACTIONARY"
        };
    }

    if (unemployment > 8) {
        return {
            source: "Labor Secretary",
            message: "The labor market is failing. We have a significant recessionary gap. Consider lowering the Reserve Ratio to stimulate investment demand.",
            priority: "HIGH",
            action: "EXPANSIONARY"
        };
    }

    if (gdpGap < -5) {
        return {
            source: "Treasury Dept",
            message: "GDP is significantly below potential. This recessionary gap will persist unless we lower interest rates to shift Aggregate Demand right.",
            priority: "MEDIUM",
            action: "EXPANSIONARY"
        };
    }

    if (inflation > 3) {
        return {
            source: "FOMC Hawks",
            message: "Inflation is creeping above our 2% target. We should consider proactive rate hikes to anchor inflation expectations.",
            priority: "LOW",
            action: "NEUTRAL"
        };
    }

    return {
        source: "Staff",
        message: "The economy is relatively stable, but our institutional partners are watching for any sudden movements. Maintain steady hands.",
        priority: "INFO",
        action: "STABLE"
    };
};
