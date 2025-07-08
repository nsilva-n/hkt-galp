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

def test_register_login():
    email = "clientuser@example.com"
    password = "secret"

    # Register (ok if already exists)
    res = register_user(email, password)
    assert res.status_code in (200, 409), f"Unexpected register status: {res.status_code}"

    # Login
    res = login_user(email, password)
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json().get("access_token")
    assert token, "Access token missing"

    # Access protected route
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/protected", headers=headers)
    assert res.status_code == 200, f"Protected access failed: {res.text}"
    data = res.json()
    assert "email" in data, "Expected 'email' in protected route response"
