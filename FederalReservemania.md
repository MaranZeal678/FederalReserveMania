# FederalReservemania

This is a web app I built where you basically play as the Chair of the Federal Reserve. You have to control the economy by keeping inflation and unemployment low so you don't get fired. It throws random economic events at you and you try your best to manage them using real macroeconomic tools. 

## Features

- **Dashboard:** You get a live terminal that shows the GDP, inflation, unemployment, and interest rate. It also draws graphs for AD/AS, the Phillips Curve, and money markets based on the live data.
- **Fed Tools:** You can actually use real Fed powers to fix the economy. You can change interest rates, alter bank reserve requirements, do Open Market Operations (buy/sell bonds), and even adjust bank capital rules like CCyB and LTV caps. I also added Forward Guidance and an Emergency Liquidity Assistance (ELA) button for when things get really bad.
- **Quant Stuff:** It has some advanced indicators like a Taylor Rule calculator, a Financial Stress Index, and the yield spread to help you predict recessions. I also coded a Monte Carlo simulator to mathematically forecast the next 24 months of inflation and GDP.

## AI Agents Used

I connected some AI agents to make the game feel more realistic and reactive:
- **Chief Economist AI:** This connects to an LLM (Large Language Model) using the Gemini API. It reads the live economic data directly from the simulation (like the inflation rate and GDP gaps) and gives you one sentence of tactical advice on what policy to change next, complete with a confidence score.
- **News Agent:** There's an automated background system that looks at the state of the economy and your recent policy decisions to generate realistic news headlines in real clock time. 

## Tech Stack
- **Frontend:** React, Tailwind CSS, and Framer Motion for the UI.
- **Backend:** Python and Flask. The actual economy math is handled by a custom engine I wrote (`engine.py`) that simulates how things like interest rates and money supply pass through the economy over time based on real economic theory.
- **Database:** It saves all your policy actions and economic snapshots to a SQLite database so there's an audit log of your decisions.
