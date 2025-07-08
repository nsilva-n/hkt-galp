from flask import Flask
from flask_jwt_extended import JWTManager, jwt_required
from app.models import db, bcrypt
from app.auth_routes import register_auth_routes
from app.participation_routes import register_participation_routes
from app.integration_routes import register_strava_routes
from app.profile_routes import register_profile_routes
from datetime import timedelta


jwt = JWTManager()

def create_app():
	app = Flask(__name__)
	app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/appdb'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['JWT_SECRET_KEY'] = 'your-secret-key'
	app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
	app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

	db.init_app(app)
	bcrypt.init_app(app)
	jwt.init_app(app)


	with app.app_context():
		db.drop_all()
		db.create_all()

	@app.route("/health", methods=["GET"])
	def health():
		return {"status": "ok"}, 200

	register_auth_routes(app)
	register_participation_routes(app)
	register_strava_routes(app)
	register_profile_routes(app)

	@app.route('/protected')
	@jwt_required()
	def protected():
		from flask_jwt_extended import get_jwt_identity
		from app.models import User
		user_id = int(get_jwt_identity())
		user = User.query.get(user_id)
		return {"email": user.email}

	return app

# Run if called directly
if __name__ == '__main__':
	app = create_app()
	app.run(host="0.0.0.0", port=5000, debug=True)
