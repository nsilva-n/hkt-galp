from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User, UserProfile, Association

def register_profile_routes(app):
    @app.route('/profile', methods=['POST'])
    @jwt_required()
    def register_profile():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json(silent=True)
        if data is None:
            return {"error": "Requisição malformada ou sem JSON"}, 400

        if UserProfile.query.filter_by(user_id=user.id).first():
            return {"error": "Profile already exists"}, 409

        # Validate required fields
        required_fields = ["country", "participation_mode"]
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return {"error": f"Campos obrigatórios ausentes: {', '.join(missing)}"}, 422

        country = data["country"]
        participation_mode = data["participation_mode"]

        if participation_mode not in ("individual", "group"):
            return {"error": "participation_mode inválido (deve ser 'individual' ou 'group')"}, 422

        distrito = data.get("distrito") if country.lower() == "portugal" else None
        concelho = data.get("concelho") if country.lower() == "portugal" else None

        if country.lower() == "portugal" and (not distrito or not concelho):
            return {"error": "Distrito e concelho são obrigatórios para Portugal"}, 422

        association_id = data.get("association_id") if participation_mode == "group" else None

        profile = UserProfile(
            user_id=user.id,
            country=country,
            distrito=distrito,
            concelho=concelho,
            participation_mode=participation_mode,
            association_id=association_id,
        )

        db.session.add(profile)
        db.session.commit()
        return {"message": "Profile created"}, 201


    @app.route('/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        user_id = int(get_jwt_identity())
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return {"error": "Profile not found"}, 404

        return {
            "country": profile.country,
            "distrito": profile.distrito,
            "concelho": profile.concelho,
            "participation_mode": profile.participation_mode,
            "association": profile.association.name if profile.association else None
        }

    @app.route('/associations', methods=['GET'])
    def get_all_associations():
        associations = Association.query.order_by(Association.name).all()
        return jsonify([{"id": a.id, "name": a.name} for a in associations])
