/**
 * NewsEngine
 * Generates headlines based on economic state and recent actions.
 */
export const generateHeadline = (state, recentAction) => {
    const { gdp, inflation, unemployment, interestRateNominal } = state;

    const templates = {
        expansion: [
            "Fed Injects Liquidity: Markets Cheer Expansionary Pivot",
            "Wall Street Rallies as Bond Buying Program Scales Up",
            "Easy Money Era? Fed Signals Commitment to Growth",
        ],
        contraction: [
            "Fed Tightens Grip: Inflation Hawks Take Command",
            "Market Slump Post-Bond Sale: Liquidity Drain Begins",
            "Higher for Longer: Central Bank Drains Cash from System",
        ],
        high_inflation: [
            "Sticker Shock: Inflation Spirals as Fed Faces Heat",
            "Cost of Living Crisis: Grocery Prices Hit Decade Highs",
            "Hyperinflation Fears Loom as Price Level Breaches Target",
        ],
        high_unemployment: [
            "Jobless Claims Surge: Recession Fears Dominate Headlines",
            "Silent Factories: Manufacturing Output Plummets",
            "Labor Market Cooling: Workers Face Uncertain Future",
        ],
        growth: [
            "Economic Engine Roars: GDP Beats All Expectations",
            "Boom Times: Industrial Production Surges to Records",
            "Prosperity Paradox: Can Growth Sustain Without Inflation?",
        ]
    };

    // Logic to select headline category
    let category = "growth";

    if (recentAction === 'BUY_BONDS') category = "expansion";
    else if (recentAction === 'SELL_BONDS') category = "contraction";
    else if (inflation > 4.0) category = "high_inflation";
    else if (unemployment > 7.0) category = "high_unemployment";
    else if (gdp > 21) category = "growth";

    const list = templates[category];
    const headline = list[Math.floor(Math.random() * list.length)];

    return {
        id: Date.now(),
        text: headline,
        category,
        timestamp: new Date().toLocaleTimeString(),
        impact: category === 'expansion' || category === 'growth' ? 'POS' : 'NEG'
    };
};
