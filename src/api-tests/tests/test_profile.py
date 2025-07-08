import os
import requests

BASE_URL = os.environ.get("BASE_URL", "http://backend:5000")

def register_user(email, password):
    return requests.post(f"{BASE_URL}/register", json={"email": email, "password": password})

def login_user(email, password):
    return requests.post(f"{BASE_URL}/login", json={"email": email, "password": password})

def get_auth_headers(email, password):
    register_user(email, password)  # Accept 409 if already exists
    login_res = login_user(email, password)
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json().get("access_token")
    assert token, "No access_token received"
    return {"Authorization": f"Bearer {token}"}

def test_profile_creation_and_fetching():
    email = "profileuser@example.com"
    password = "secure"
    headers = get_auth_headers(email, password)

    # Step 1: Ensure profile does not exist
    res = requests.get(f"{BASE_URL}/profile", headers=headers)
    if res.status_code == 200:
        return  # Skip test if profile already exists

    # Step 2: Create an association (if API allows) or assume one exists
    res = requests.get(f"{BASE_URL}/associations")
    assert res.status_code == 200, f"Failed to fetch associations: {res.text}"
    associations = res.json()

    if not associations:
        # For test purposes, fail fast with clear reason
        raise AssertionError("No associations found. Seed the DB with at least one association.")

    assoc_id = associations[0]["id"]

    # Step 3: Create profile (valid, group + association)
    payload = {
        "country": "Portugal",
        "participation_mode": "group",
        "distrito": "Lisboa",
        "concelho": "Lisboa",
        "association_id": assoc_id
    }

    res = requests.post(f"{BASE_URL}/profile", headers=headers, json=payload)
    assert res.status_code in (201, 409), f"Profile creation failed: {res.status_code}, {res.text}"

    # Step 4: Duplicate profile creation should return 409
    res = requests.post(f"{BASE_URL}/profile", headers=headers, json=payload)
    assert res.status_code == 409, "Expected conflict on duplicate profile creation"

    # Step 5: Fetch and validate profile
    res = requests.get(f"{BASE_URL}/profile", headers=headers)
    assert res.status_code == 200, f"Failed to fetch profile: {res.text}"
    data = res.json()
    assert data["country"] == "Portugal"
    assert data["participation_mode"] == "group"
    assert data["association"] is not None
