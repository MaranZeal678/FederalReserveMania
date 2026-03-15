# FederalReserveMania 

Welcome to **FederalReserveMania**! This is an interactive web-based macroeconomic simulator where *you* get to be the Chair of the Central Bank (like the Federal Reserve). Your job is to keep the economy stable, fight inflation, and make sure people have jobs, all while dealing with unexpected global events.

## What is this project?
FederalReserveMania is a dashboard that gives you control over a simulated economy. You watch live charts and data feeds, then make decisions to speed up or slow down the economy. If inflation gets too high or unemployment spikes, you could lose your job as the Central Banker!

## Key Features 🛠️

### 1. The Central Banker Dashboard
- **Live Economic Indicators**: Watch Nominal GDP, Consumer Price Index (CPI) Inflation, Unemployment Rate (U-Rate), and the Benchmark Interest Rate change in real-time.
- **Interactive Graphs**: View live updates on the Aggregate Supply/Aggregate Demand (AS/AD) model, the Phillips Curve, the Money Market, and Foreign Exchange.

### 2. Upgraded Federal Reserve Powers
You have multiple tools to steer the economy:
- **Interest Rates & Reserve Requirements**: Change how much it costs to borrow money and how much cash banks must keep in the vault.
- **Open Market Operations**: Buy or sell bonds to add or remove cash from the economy.
- **Countercyclical Capital Buffer (CCyB)**: Make banks hold more capital during good times to prevent a crash later.
- **Loan-to-Value (LTV) Cap**: Limit how much risk banks can take when giving out loans.
- **Emergency Liquidity Assistance (ELA)**: A "panic button" to inject cash into the system during a financial crisis.
- **Forward Guidance**: Choose the tone of your public speeches (Hawkish, Dovish, or Neutral) to influence how people expect prices to change in the future.

### 3. Quantitative (Quant) Algorithms 
Professional tools to help you make decisions:
- **Taylor Rule Target**: A math formula that suggests what your interest rate *should* be based on inflation and GDP.
- **Financial Stress Index**: A live score showing how panicked the financial markets are.
- **Yield Spread (10Y - 2Y)**: An indicator that often predicts recessions.
- **Monte Carlo Simulations**: Run thousands of simulated futures to see the probability of where inflation and GDP might go in the next 24 months.

## AI Agents & Smart Systems 🤖

This project uses smart, automated engines (agents) to make the simulation feel alive:

1. **Strategic Advisor (Quant AI Analysis)**: 
   This is an automated system that constantly looks at your economy (inflation, GDP gap, unemployment) and gives you direct advice. For example, if inflation goes over 10%, your "Chief Economist" will pop up with a high-priority warning telling you to sell bonds immediately. It also calculates a confidence score for its advice.

2. **The News Engine**: 
   As the simulation runs, an automated journalist agent writes realistic news headlines based on your actions and the state of the economy. If you rapidly print money, you might see headlines like "Wall Street Rallies as Bond Buying Program Scales Up," but if you crash the economy, you'll see "Silent Factories: Manufacturing Output Plummets."

## Technical Breakdown 💻
- **Frontend**: Built with **React** (Vite) and **Tailwind CSS**. It uses smooth animations (Framer Motion) and looks like a high-tech terminal.
- **Backend & Simulation**: Written in **Python** (using the Flask framework). The backend runs the complex math (`engine.py`) that decides how the economy reacts to your choices using real economic theories.
- **Database**: Uses a database system to save the history of everything that happens so you can audit your past mistakes (or successes!).

---
*Good luck, Chair. The economy is in your hands.*
