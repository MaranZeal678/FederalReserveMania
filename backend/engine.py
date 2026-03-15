import random
import math

class EconomyEngine:
    def __init__(self):
        # Constants
        self.TARGET_INFLATION = 0.02  # 2%
        self.POTENTIAL_GDP_GROWTH = 0.025 # 2.5%
        self.NATURAL_UNEMPLOYMENT = 0.045 # 4.5%
        self.NEUTRAL_RATE = 0.025 # 2.5% (r*)
        
        # Current State
        self.tick = 0
        self.gdp_growth = 0.022
        self.inflation = 0.018
        self.unemployment = 0.05
        self.interest_rate = 0.025
        self.reserve_ratio = 0.10
        self.m2_supply = 20000.0  # billions
        self.velocity_of_money = 1.2
        self.government_debt = 30000.0 # billions
        
        # Policy Lags: Interest rate effects take time (3 months)
        self.rate_history = [0.025, 0.025, 0.025] 
        
        # Phase 2: Macroprudential & Regulatory
        self.ccyb = 0.025 # Countercyclical Capital Buffer
        self.ltv_cap = 0.80 # 80% Loan-to-Value
        self.dti_cap = 0.36 # 36% Debt-to-Income
        self.financial_stress_index = 0.1
        
        # Phase 2: Financial Markets
        self.sp500_index = 5000.0
        self.yield_10y = 0.04
        self.yield_2y = 0.038
        self.exchange_rate = 100.0 # Index
        self.net_exports = 0
        
        # Policy Inputs
        self.target_rate = 0.025
        self.monthly_qe_qt = 0.0
        self.forward_guidance_text = ""
        self.inflation_expectations = 0.02
        
        # History for charts
        self.history = []
        self.record_snapshot()

    def record_snapshot(self):
        self.history.append({
            "tick": self.tick,
            "gdp_growth": self.gdp_growth,
            "inflation": self.inflation,
            "unemployment": self.unemployment,
            "interest_rate": self.interest_rate,
            "m2_supply": self.m2_supply,
            "taylor_rule_rate": self.calculate_taylor_rule(),
            "sp500": self.sp500_index,
            "yield_spread": self.yield_10y - self.yield_2y,
            "stress_index": self.financial_stress_index,
            "debt_to_gdp": self.government_debt / (self.m2_supply * 5) # Rough proxy for GDP level
        })
        if len(self.history) > 120: # Keep 10 years of monthly data
            self.history.pop(0)

    def calculate_taylor_rule(self):
        # i = r* + pi + 0.5(pi - pi*) + 0.5(y - y_pot)
        output_gap = self.gdp_growth - self.POTENTIAL_GDP_GROWTH
        inflation_gap = self.inflation - self.TARGET_INFLATION
        
        taylor_rate = self.NEUTRAL_RATE + self.inflation + (0.5 * inflation_gap) + (0.5 * output_gap)
        return max(0, taylor_rate)

    def step(self):
        self.tick += 1
        
        # Update rate history for 3-month lag
        self.rate_history.append(self.interest_rate)
        lagged_rate = self.rate_history.pop(0)

        # 1. Interest Rate Transmission (3-month Lagged)
        interest_sensitivity = 0.4
        gdp_shock = random.normalvariate(0, 0.002)
        
        # Real Rate Calculation using lagged nominal rate
        self.gdp_growth = self.POTENTIAL_GDP_GROWTH - interest_sensitivity * (lagged_rate - self.inflation - self.NEUTRAL_RATE) + gdp_shock
        
        # 2. Phillips Curve (Inflation)
        # pi_t = pi_expectations + kappa * (y - y_pot)
        # We use a weighted average of past inflation for expectations
        phi = 0.7 
        kappa = 0.15
        inflation_shock = random.normalvariate(0, 0.001)
        output_gap = self.gdp_growth - self.POTENTIAL_GDP_GROWTH
        
        self.inflation = (phi * self.inflation + (1 - phi) * self.TARGET_INFLATION) + kappa * output_gap + inflation_shock
        
        # 3. Okun's Law (Unemployment)
        # u - u_nat = -0.5 * (y - y_pot)
        u_sensitivity = 0.5
        self.unemployment = self.NATURAL_UNEMPLOYMENT - u_sensitivity * (self.gdp_growth - self.POTENTIAL_GDP_GROWTH)
        self.unemployment = max(0.02, self.unemployment) # Floor at 2%
        
        # 4. Money Supply Dynamics
        # M2 influenced by QE/QT and multiplier (1/reserve_ratio)
        multiplier = 1.0 / self.reserve_ratio
        self.m2_supply += self.monthly_qe_qt * multiplier
        # Velocity affects inflation slightly
        self.m2_growth = self.monthly_qe_qt / self.m2_supply if self.m2_supply > 0 else 0
        self.inflation += self.m2_growth * 0.1
        
        # 5. Financial Markets & Macroprudential
        self.update_financial_markets()
        self.calculate_fiscal_loop()
        
        # 6. Black Swan Events
        if random.random() < 0.02: # 2% chance per tick
            self.apply_black_swan()
            
        self.record_snapshot()
        return self.get_state()

    def update_financial_markets(self):
        # S&P 500: DCF approach + Sentiment
        # Discount rate increases with interest rate
        discount_rate = self.interest_rate + 0.05 # 5% equity risk premium
        expected_earnings = self.m2_supply * 0.05
        self.sp500_index = (expected_earnings / max(0.01, discount_rate)) * (1 + (self.gdp_growth * 10))
        self.sp500_index += random.normalvariate(0, 50)
        
        # Yield Curve
        self.yield_2y = self.interest_rate + 0.005
        self.yield_10y = self.NEUTRAL_RATE + self.inflation_expectations + 0.01 # Term premium
        
        # Exchange Rate (Interest Rate Parity)
        global_rate = 0.03
        self.exchange_rate += (self.interest_rate - global_rate) * 100
        self.net_exports = - (self.exchange_rate - 100) * 2
        self.gdp_growth += self.net_exports / 10000

        # Stress Index
        yield_gap = max(0, self.yield_2y - self.yield_10y) # Inversion adds stress
        self.financial_stress_index = (yield_gap * 10) + (self.unemployment * 2) + (abs(self.inflation - self.TARGET_INFLATION) * 5)
        
        # Macroprudential impact on Credit
        # High CCyB or low LTV slows credit/growth
        credit_drag = (self.ccyb * 0.5) + (0.8 - self.ltv_cap)
        self.gdp_growth -= credit_drag * 0.1

    def calculate_fiscal_loop(self):
        # High rates increase debt servicing costs
        interest_cost = self.government_debt * (self.yield_10y / 12)
        self.government_debt += interest_cost
        # Debt drag on economy
        debt_to_proxy_gdp = self.government_debt / (self.m2_supply * 5)
        if debt_to_proxy_gdp > 1.2:
            self.gdp_growth -= 0.005 # Structural drag

    def apply_black_swan(self):
        events = [
            {"name": "Oil Price Shock", "gdp_impact": -0.02, "inflation_impact": 0.03},
            {"name": "Tech Boom", "gdp_impact": 0.03, "inflation_impact": -0.01},
            {"name": "Financial Crisis", "gdp_impact": -0.05, "inflation_impact": -0.02},
            {"name": "Supply Chain Crisis", "gdp_impact": -0.01, "inflation_impact": 0.04}
        ]
        ev = random.choice(events)
        self.gdp_growth += ev["gdp_impact"]
        self.inflation += ev["inflation_impact"]
        print(f"BLACK SWAN: {ev['name']}!")

    def run_monte_carlo(self, simulations=100, horizons=24):
        """Runs parallel simulations to generate a fan chart of inflation/gdp."""
        results = {"inflation": [], "gdp_growth": []}
        import copy
        
        for _ in range(simulations):
            temp_engine = copy.deepcopy(self)
            path_inf = []
            path_gdp = []
            for _ in range(horizons):
                state = temp_engine.step()
                path_inf.append(state["inflation"])
                path_gdp.append(state["gdp_growth"])
            results["inflation"].append(path_inf)
            results["gdp_growth"].append(path_gdp)
        return results

    def get_ai_advice(self):
        """Generates an AI policy recommendation using Gemini or a heuristic fallback."""
        import os
        
        api_key = os.environ.get("GEMINI_API_KEY")
        
        # 1. Gather Economic Context
        inf_gap = self.inflation - self.TARGET_INFLATION
        gdp_gap = self.gdp_growth - self.POTENTIAL_GDP_GROWTH
        stress = self.financial_stress_index
        
        # 2. Heuristic Fallback Strategy
        heuristic_advice = ""
        heuristic_confidence = 0.8
        
        if inf_gap > 0.01:
            heuristic_advice = "Strongly recommend hiking rates to combat overheating inflation."
            heuristic_confidence = 0.9
        elif stress > 1.0:
            heuristic_advice = "Financial stress is high. Recommend holding rates and deploying ELA if necessary."
            heuristic_confidence = 0.7
        elif gdp_gap < -0.01:
            heuristic_advice = "GDP growth is stalling. Consider lowering rates or increasing QE."
            heuristic_confidence = 0.65
        else:
            heuristic_advice = "Core indicators are stable. Maintain current policy stance."
            heuristic_confidence = 0.85
            
        # 3. Attempt LLM Call if Key Exists
        if api_key:
            try:
                from google import genai
                from google.genai import types
                
                client = genai.Client(api_key=api_key)
                
                system_prompt = f"""
You are the Chief Economist of the Central Bank. You are advising the Fed Chair (the user).
Current Economic State:
- Inflation: {self.inflation * 100:.2f}% (Target: 2.00%)
- GDP Growth: {self.gdp_growth * 100:.2f}% (Potential: 2.50%)
- Unemployment: {self.unemployment * 100:.2f}%
- Interest Rate: {self.interest_rate * 100:.2f}%
- Taylor Rule Target: {self.calculate_taylor_rule() * 100:.2f}%
- Financial Stress Index: {self.financial_stress_index:.2f}

Based on this precise data, provide ONE short, direct sentence of advice on what policy action the Fed Chair should take.
Focus on: Interest Rates, Quantitative Easing/Tightening (QE/QT), or Emergency Liquidity.
Address the Chair directly. Be extremely concise and professional.
"""
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=system_prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2, # Keep it analytical
                        max_output_tokens=50
                    )
                )
                
                if response.text:
                    # Confidence is high if LLM succeeds, but slightly random for effect
                    return {"recommendation": response.text.strip(), "confidence_score": 0.92}
                    
            except Exception as e:
                print(f"LLM AI Agent Failed: {e}. Using heuristic fallback.")
                pass 
                
        # 4. Return Fallback if no key or API failed
        return {"recommendation": heuristic_advice, "confidence_score": heuristic_confidence}

    def update_policy(self, params):
        if 'interest_rate' in params:
            self.interest_rate = float(params['interest_rate'])
        if 'reserve_ratio' in params:
            self.reserve_ratio = float(params['reserve_ratio'])
        if 'qe_qt' in params:
            self.monthly_qe_qt = float(params['qe_qt'])
        if 'ccyb' in params:
            self.ccyb = float(params['ccyb'])
        if 'ltv_cap' in params:
            self.ltv_cap = float(params['ltv_cap'])
        if 'forward_guidance' in params:
            self.forward_guidance_text = params['forward_guidance']
            # Simple AI sentiment proxy for now
            if "hawkish" in self.forward_guidance_text.lower():
                self.inflation_expectations -= 0.001
            elif "dovish" in self.forward_guidance_text.lower():
                self.inflation_expectations += 0.001

    def get_state(self):
        return {
            "tick": self.tick,
            "gdp_growth": round(self.gdp_growth, 4),
            "inflation": round(self.inflation, 4),
            "unemployment": round(self.unemployment, 4),
            "interest_rate": round(self.interest_rate, 4),
            "m2_supply": round(self.m2_supply, 2),
            "taylor_rule_rate": round(self.calculate_taylor_rule(), 4),
            "sp500": round(self.sp500_index, 2),
            "yield_spread": round(self.yield_10y - self.yield_2y, 4),
            "stress_index": round(self.financial_stress_index, 4),
            "exchange_rate": round(self.exchange_rate, 2),
            "net_exports": round(self.net_exports, 2),
            "ccyb": self.ccyb,
            "ltv_cap": self.ltv_cap,
            "history": self.history[-60:] # Return last 5 years
        }
