from app import app
from models import db, EconomicSnapshot

historical_data = [
    {"year": 1994, "gdp": 4.0, "inf": 2.6, "unemp": 6.1, "rate": 4.21, "event": "Post-Recession Stability"},
    {"year": 1995, "gdp": 2.7, "inf": 2.8, "unemp": 5.6, "rate": 5.84, "event": "Dot-com Inclusion Begins"},
    {"year": 1996, "gdp": 3.8, "inf": 2.9, "unemp": 5.4, "rate": 5.30, "event": "Internet Boom"},
    {"year": 1997, "gdp": 4.5, "inf": 2.3, "unemp": 4.9, "rate": 5.46, "event": "Rapid Growth Phase"},
    {"year": 1998, "gdp": 4.5, "inf": 1.6, "unemp": 4.5, "rate": 5.35, "event": "Low Inflation Boom"},
    {"year": 1999, "gdp": 4.8, "inf": 2.2, "unemp": 4.2, "rate": 4.97, "event": "Dot-com Peak"},
    {"year": 2000, "gdp": 4.1, "inf": 3.4, "unemp": 4.0, "rate": 6.24, "event": "Fed Rate Hikes"},
    {"year": 2001, "gdp": 1.0, "inf": 2.8, "unemp": 4.7, "rate": 3.88, "event": "Dot-com Crash / 9-11 Shock"},
    {"year": 2002, "gdp": 1.7, "inf": 1.6, "unemp": 5.8, "rate": 1.67, "event": "Recovery Easing"},
    {"year": 2003, "gdp": 2.8, "inf": 2.3, "unemp": 6.0, "rate": 1.13, "event": "Iraq War Impact"},
    {"year": 2004, "gdp": 3.8, "inf": 2.7, "unemp": 5.5, "rate": 1.35, "event": "Housing Boom Accelerates"},
    {"year": 2005, "gdp": 3.5, "inf": 3.4, "unemp": 5.1, "rate": 3.22, "event": "Tightening Cycle"},
    {"year": 2006, "gdp": 2.9, "inf": 3.2, "unemp": 4.6, "rate": 4.97, "event": "Housing Peak"},
    {"year": 2007, "gdp": 2.0, "inf": 2.8, "unemp": 4.6, "rate": 5.02, "event": "Subprime Warning Signs"},
    {"year": 2008, "gdp": 0.1, "inf": 3.8, "unemp": 5.8, "rate": 1.92, "event": "Great Financial Crisis (Crash)"},
    {"year": 2009, "gdp": -2.5, "inf": -0.4, "unemp": 9.3, "rate": 0.16, "event": "Great Recession Lowest Point"},
    {"year": 2010, "gdp": 2.7, "inf": 1.6, "unemp": 9.6, "rate": 0.18, "event": "Early Recovery / QE1"},
    {"year": 2011, "gdp": 1.6, "inf": 3.2, "unemp": 8.9, "rate": 0.10, "event": "Debt Ceiling Crisis"},
    {"year": 2012, "gdp": 2.3, "inf": 2.1, "unemp": 8.1, "rate": 0.14, "event": "Slow Steady Growth"},
    {"year": 2013, "gdp": 1.8, "inf": 1.5, "unemp": 7.4, "rate": 0.11, "event": "Eurozone Crisis Spillover"},
    {"year": 2014, "gdp": 2.3, "inf": 1.6, "unemp": 6.2, "rate": 0.09, "event": "Oil Price Collapse"},
    {"year": 2015, "gdp": 2.7, "inf": 0.1, "unemp": 5.3, "rate": 0.13, "event": "Pre-Normalization"},
    {"year": 2016, "gdp": 1.7, "inf": 1.3, "unemp": 4.9, "rate": 0.39, "event": "Modest Recovery"},
    {"year": 2017, "gdp": 2.2, "inf": 2.1, "unemp": 4.4, "rate": 1.00, "event": "Fiscal Stimulus / Tax Cuts"},
    {"year": 2018, "gdp": 3.0, "inf": 2.4, "unemp": 3.9, "rate": 1.83, "event": "Full Employment Reached"},
    {"year": 2019, "gdp": 2.3, "inf": 1.8, "unemp": 3.7, "rate": 2.16, "event": "Pre-COVID Highs"},
    {"year": 2020, "gdp": -3.4, "inf": 1.2, "unemp": 8.1, "rate": 0.38, "event": "COVID-19 Global Pandemic Lockdown"},
    {"year": 2021, "gdp": 5.9, "inf": 4.7, "unemp": 5.4, "rate": 0.08, "event": "Post-COVID Rebounding Surge"},
    {"year": 2022, "gdp": 1.9, "inf": 8.0, "unemp": 3.6, "rate": 1.68, "event": "Inflationary Spike / Supply Shocks"},
    {"year": 2023, "gdp": 2.5, "inf": 4.1, "unemp": 3.6, "rate": 5.03, "event": "Aggressive Rate Hikes"},
    {"year": 2024, "gdp": 2.1, "inf": 2.9, "unemp": 3.9, "rate": 5.33, "event": "Towards Soft Landing"},
]

def seed_db():
    with app.app_context():
        db.create_all()
        if EconomicSnapshot.query.first():
            print("DB already seeded.")
            return
        
        for item in historical_data:
            s = EconomicSnapshot(
                year=item['year'],
                gdp_growth=item['gdp'],
                inflation=item['inf'],
                unemployment=item['unemp'],
                fed_funds_rate=item['rate'],
                event_label=item['event']
            )
            db.session.add(s)
        
        db.session.commit()
        print("Successfully seeded 30 years of economic data.")

if __name__ == "__main__":
    seed_db()
