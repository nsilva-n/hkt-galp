from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTExtendedException
from app.models import db, Participation, User, Association, UserProfile
from psycopg2.extras import DateTimeTZRange
from dateutil.parser import parse as parse_datetime
from sqlalchemy import func


def register_participation_routes(app):

    @app.route('/participation', methods=['POST'])
    def register_participation():
        data = request.json
        
        print(data, flush=True)

        try:
            # Handle authentication (optional)
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
            except Exception:
                user_id = None
            user = User.query.get(user_id) if user_id else None

            # Parse dates
            start = parse_datetime(data['start_date'])
            end_str = data.get('end_date')
            end = parse_datetime(end_str) if end_str else start

            # Determine participation details
            if user and user.profile:
                # Extract from profile
                profile = user.profile
                district = profile.distrito
                municipality = profile.concelho
                participation_mode = profile.participation_mode
                association_id = profile.association_id if profile.participation_mode == 'group' else None
            else:
                # 🔒 Unauthenticated → require full info in payload
                required_fields = ['district', 'municipality', 'participation_mode']
                for field in required_fields:
                    if field not in data:
                        return {"error": f"Missing field: {field}"}, 400

                district = data['district']
                municipality = data['municipality']
                participation_mode = data.get('participation_mode', 'individual')

                if participation_mode not in ['individual', 'group']:
                    return {"error": "participation_mode must be 'individual' or 'group'"}, 400

                if participation_mode == 'group':
                    association_name = data.get('association_name')
                    if not association_name:
                        return {"error": "Missing field: association_name"}, 400

                    assoc = Association.query.filter_by(name=association_name).first()
                    if not assoc:
                        return {"error": "Associação não encontrada"}, 404

                    association_id = assoc.id
                else:
                    association_id = None

            # Create Participation
            participation = Participation(
                participation_mode=participation_mode,
                email=user.email if user else data.get('email', 'anon@anonymous.com'),
                activity_type=data['activity_type'],
                distance_km=data.get('distance_km'),
                date_or_interval=DateTimeTZRange(start, end, '[]'),
                district=district,
                municipality=municipality,
                association_id=association_id
            )

            db.session.add(participation)
            db.session.commit()

            return {"message": "Participation submitted"}

        except KeyError as e:
            return {"error": f"Missing field: {e.args[0]}"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    @app.route('/participation/my', methods=['GET'])
    @jwt_required()
    def get_my_participations():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        participations = Participation.query.filter_by(email=user.email).order_by(Participation.id.desc()).all()

        return jsonify([
            {
                "id": p.id,
                "activity_type": p.activity_type,
                "participation_mode": p.participation_mode,
                "distance_km": float(p.distance_km or 0),
                "start": p.date_or_interval.lower.isoformat(),
                "end": p.date_or_interval.upper.isoformat(),
                "district": p.district,
                "municipality": p.municipality
            }
            for p in participations
        ])

    @app.route('/participation/last/<int:n>', methods=['GET'])
    def get_last_n_participations(n):
        participations = Participation.query.order_by(Participation.id.desc()).limit(n).all()

        return jsonify([
            {
                "id": p.id,
                "email": p.email,
                "activity_type": p.activity_type,
                "distance_km": float(p.distance_km or 0),
                "start": p.date_or_interval.lower.isoformat(),
                "end": p.date_or_interval.upper.isoformat(),
                "district": p.district,
                "municipality": p.municipality
            }
            for p in participations
        ])

    @app.route('/participation/my/total_km', methods=['GET'])
    @jwt_required()
    def get_my_total_km():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        total = db.session.query(func.coalesce(func.sum(Participation.distance_km), 0)) \
            .filter(Participation.email == user.email).scalar()

        return {"total_km": float(total)}

    @app.route('/participation/total_km', methods=['GET'])
    def get_total_km_all_users():
        total = db.session.query(func.coalesce(func.sum(Participation.distance_km), 0)).scalar()
        return {"total_km": float(total)}

    @app.route('/participation/total_km/district/<string:district>', methods=['GET'])
    def get_total_km_by_district(district):
        total = db.session.query(func.coalesce(func.sum(Participation.distance_km), 0)) \
            .filter(Participation.district.ilike(district)).scalar()
        return {"total_km": float(total)}

    @app.route('/participation/total_km/municipality/<string:municipality>', methods=['GET'])
    def get_total_km_by_municipality(municipality):
        total = db.session.query(func.coalesce(func.sum(Participation.distance_km), 0)) \
            .filter(Participation.municipality.ilike(municipality)).scalar()
        return {"total_km": float(total)}
