from flask import request
from flask_jwt_extended import create_access_token
from app.models import db, bcrypt, User

def register_auth_routes(app):
    @app.route('/register', methods=['POST'])
    def register():
        data = request.json
        if User.query.filter_by(email=data["email"]).first():
            return {"error": "User already exists"}, 409
        user = User(
            email=data["email"],
            password_hash=bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        )
        db.session.add(user)
        db.session.commit()
        return {"message": "User registered"}

    @app.route('/login', methods=['POST'])
    def login():
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if user and user.check_password(data["password"]):
            token = create_access_token(identity=str(user.id))
            return {"access_token": token}
        return {"error": "Invalid credentials"}, 401
