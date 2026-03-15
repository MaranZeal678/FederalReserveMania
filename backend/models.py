from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def set_password(self, password):
        # Force a widely compatible hashing method
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class EconomicSnapshot(db.Model):
    """
    Stores 30 years of US Economic Data (1994-2024)
    """
    __tablename__ = 'economic_history'
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, unique=True, nullable=False)
    gdp_growth = db.Column(db.Float)
    inflation = db.Column(db.Float)
    unemployment = db.Column(db.Float)
    fed_funds_rate = db.Column(db.Float)
    event_label = db.Column(db.String(200)) # e.g. "Dot Com Bubble", "2008 Financial Crisis"

class UserActionLog(db.Model):
    """
    Tracks every action taken by the user in-game.
    """
    __tablename__ = 'action_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    tick = db.Column(db.Integer)
    action_type = db.Column(db.String(50))
    state_before = db.Column(db.JSON)
    state_after = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
