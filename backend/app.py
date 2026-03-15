from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, EconomicSnapshot, UserActionLog
from engine import EconomyEngine
import os

app = Flask(__name__)
# Database setup: Use SQLite for zero-config locally
# MySQL Database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+mysqlconnector://root@localhost/macromania')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'development-key-central-banker'

# Enable CORS with explicit origins and methods
CORS(app, resources={r"/*": {"origins": "*"}})
db.init_app(app)

# Initialize Economy Engine
sim_engine = EconomyEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "engine": "Python-Macromania-V1"})

# --- Authentication Endpoints ---

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"error": "User already exists"}), 400
    
    user = User(username=data.get('username'))
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        return jsonify({
            "token": "fake-jwt-token-for-demo",
            "username": user.username,
            "id": user.id
        })
    return jsonify({"error": "Invalid credentials"}), 401

# --- Economic Data Endpoints ---

@app.route('/data/historical', methods=['GET'])
def get_historical_data():
    snapshots = EconomicSnapshot.query.order_by(EconomicSnapshot.year).all()
    return jsonify([{
        "year": s.year,
        "gdp": s.gdp_growth,
        "inflation": s.inflation,
        "unemployment": s.unemployment,
        "rate": s.fed_funds_rate,
        "event": s.event_label
    } for s in snapshots])

@app.route('/data/log_action', methods=['POST'])
def log_action():
    data = request.json
    log = UserActionLog(
        user_id=data.get('userId'),
        tick=data.get('tick'),
        action_type=data.get('action'),
        state_before=data.get('before'),
        state_after=data.get('after')
    )
    db.session.add(log)
    db.session.commit()
    return jsonify({"status": "logged"}), 201

@app.route('/data/logs', methods=['GET'])
def get_logs():
    logs = UserActionLog.query.order_by(UserActionLog.timestamp.desc()).limit(50).all()
    return jsonify([{
        "id": l.id,
        "tick": l.tick,
        "action": l.action_type,
        "timestamp": l.timestamp.strftime("%H:%M:%S"),
        "before": l.state_before,
        "after": l.state_after
    } for l in logs])

# --- Simulation Endpoints ---

@app.route('/sim/state', methods=['GET'])
def get_sim_state():
    return jsonify(sim_engine.get_state())

@app.route('/sim/tick', methods=['POST'])
def sim_tick():
    state = sim_engine.step()
    return jsonify(state)

@app.route('/sim/update', methods=['POST'])
def update_policy():
    data = request.json
    sim_engine.update_policy(data)
    return jsonify(sim_engine.get_state())

@app.route('/sim/reset', methods=['POST'])
def reset_sim():
    global sim_engine
    sim_engine = EconomyEngine()
    return jsonify(sim_engine.get_state())

@app.route('/sim/ai_advice', methods=['GET'])
def get_ai_advice():
    return jsonify(sim_engine.get_ai_advice())

@app.route('/sim/monte_carlo', methods=['GET'])
def get_monte_carlo():
    results = sim_engine.run_monte_carlo()
    return jsonify(results)

@app.route('/sim/ela', methods=['POST'])
def deploy_ela():
    # Emergency Liquidity Assistance: Spikes reserves temporarily
    sim_engine.m2_supply += 1000
    sim_engine.financial_stress_index = max(0, sim_engine.financial_stress_index - 0.5)
    return jsonify(sim_engine.get_state())

@app.route('/sim/export', methods=['GET'])
def export_data():
    # Return history as CSV
    import csv
    import io
    from flask import make_response
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=sim_engine.history[0].keys())
    writer.writeheader()
    writer.writerows(sim_engine.history)
    
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=sim_data.csv"
    response.headers["Content-type"] = "text/csv"
    return response

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5001, debug=True)
