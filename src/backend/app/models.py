from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import CheckConstraint, Index
from sqlalchemy.dialects.postgresql import TSTZRANGE

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    strava_access_token = db.Column(db.String(255), nullable=True)
    strava_refresh_token = db.Column(db.String(255), nullable=True)
    strava_athlete_id = db.Column(db.String(64), nullable=True)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Participation(db.Model):
    __tablename__ = "participation"

    id = db.Column(db.Integer, primary_key=True)
    participation_mode = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    activity_type = db.Column(db.String(100), nullable=False)
    distance_km = db.Column(db.Numeric(6, 2), CheckConstraint('distance_km >= 0'), nullable=True)
    date_or_interval = db.Column(TSTZRANGE, nullable=False)
    district = db.Column(db.String(100), nullable=False)
    municipality = db.Column(db.String(100), nullable=False)
    association_id = db.Column(db.Integer, db.ForeignKey("association.id"), nullable=True)

    association = db.relationship("Association", backref="participations")

    __table_args__ = (
        CheckConstraint("participation_mode IN ('individual', 'group')", name="check_participation_mode"),
        Index("ix_participation_email", "email")
    )


class Association(db.Model):
    __tablename__ = "association"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    # Relationships
    user_profiles = db.relationship("UserProfile", back_populates="association")


class UserProfile(db.Model):
    __tablename__ = "user_profile"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=True, nullable=False)
    country = db.Column(db.String(100), nullable=False)
    distrito = db.Column(db.String(100), nullable=True)
    concelho = db.Column(db.String(100), nullable=True)
    participation_mode = db.Column(db.String(20), nullable=False)

    # Optional if participation_mode is 'group'
    association_id = db.Column(db.Integer, db.ForeignKey("association.id"), nullable=True)

    # Relationships
    user = db.relationship("User", backref=db.backref("profile", uselist=False))
    association = db.relationship("Association", back_populates="user_profiles")

    __table_args__ = (
        CheckConstraint("participation_mode IN ('individual', 'group')", name="check_user_profile_participation_mode"),
    )
