import os
import requests
from flask import request, redirect, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import urllib.parse
from app.models import db, User  # Assuming User has strava fields

STRAVA_CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
STRAVA_CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
STRAVA_REDIRECT_URI = os.getenv("STRAVA_REDIRECT_URI")

def register_strava_routes(app):
	@app.route('/strava/authorize')
	@jwt_required()
	def strava_authorize():
		user_id = get_jwt_identity()
		state = str(user_id)

		url = (
			"https://www.strava.com/oauth/authorize"
			f"?client_id={STRAVA_CLIENT_ID}"
			"&response_type=code"
			f"&redirect_uri={urllib.parse.quote(STRAVA_REDIRECT_URI)}"
			"&scope=read,activity:read"
			f"&state={state}"
			"&approval_prompt=auto"
		)
		return redirect(url)
	

	@app.route('/strava/callback')
	def strava_callback():
		code = request.args.get('code')
		error = request.args.get('error')
		user_id = request.args.get('state')

		print(f"Strava callback code: {code}", flush=True)
		print(f"Strava callback error: {error}", flush=True)
		print(f"Redirect URI: {STRAVA_REDIRECT_URI}", flush=True)

		if error:
			return {"error": f"Authorization failed: {error}"}, 400

		if not code:
			return {"error": "Missing authorization code"}, 400

		token_payload = {
			'client_id': STRAVA_CLIENT_ID,
			'client_secret': STRAVA_CLIENT_SECRET,
			'code': code,
			'grant_type': 'authorization_code',
			'redirect_uri': STRAVA_REDIRECT_URI
		}

		print("Sending token request to Strava with payload:", token_payload, flush=True)

		token_res = requests.post("https://www.strava.com/oauth/token", data=token_payload)

		print("Token response status:", token_res.status_code, flush=True)
		print("Token response body:", token_res.text, flush=True)

		if token_res.status_code != 200:
			return {
				"error": "Failed to get Strava token",
				"details": token_res.text
			}, 400

		token_data = token_res.json()
		access_token = token_data['access_token']
		refresh_token = token_data['refresh_token']
		strava_user_id = token_data['athlete']['id']

		user = User.query.get(user_id)
		if not user:
			return {"error": "User not found"}, 404

		user.strava_access_token = access_token
		user.strava_refresh_token = refresh_token
		user.strava_athlete_id = strava_user_id
		db.session.commit()

		return {"message": "Strava connected successfully"}



	@app.route('/strava/activities', methods=['GET'])
	@jwt_required()
	def get_strava_activities():
		user_id = get_jwt_identity()
		user = User.query.get(user_id)
		
		if not user:
			return {"error": "User not found"}, 404

		if not user.strava_access_token:
			return {"error": "Strava not connected"}, 400


		headers = {"Authorization": f"Bearer {user.strava_access_token}"}
		params = {
			"per_page": 50,
			"page": 1
		}
		res = requests.get("https://www.strava.com/api/v3/athlete/activities", headers=headers, params=params)
		if res.status_code != 200:
			return {"error": "Failed to fetch activities"}, res.status_code

		return jsonify(res.json())
