import os
import requests
from datetime import datetime, timedelta

BASE_URL = os.environ.get("BASE_URL", "http://backend:5000")

def get_auth_headers():
    email = "clientuser@example.com"
    password = "secret"
    # Register (ignore if already exists)
    requests.post(f"{BASE_URL}/register", json={"email": email, "password": password})
    # Login
    r = requests.post(f"{BASE_URL}/login", json={"email": email, "password": password})
    token = r.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

def test_submit_participation():
    headers = get_auth_headers()
    start = datetime.now()
    end = start + timedelta(hours=1)

    res = requests.post(f"{BASE_URL}/participation", headers=headers, json={
        "participation_mode": "individual",
        "activity_type": "running",
        "distance_km": 5.2,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "district": "Lisbon",
        "municipality": "Lisboa"
    })
    assert res.status_code == 200
    assert "message" in res.json()

def test_my_participations():
    headers = get_auth_headers()
    res = requests.get(f"{BASE_URL}/participation/my", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert len(res.json()) >= 1

def test_last_n_participations():
    res = requests.get(f"{BASE_URL}/participation/last/5")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_my_total_km():
    headers = get_auth_headers()
    res = requests.get(f"{BASE_URL}/participation/my/total_km", headers=headers)
    assert res.status_code == 200
    assert "total_km" in res.json()

def test_total_km_all_users():
    res = requests.get(f"{BASE_URL}/participation/total_km")
    assert res.status_code == 200
    assert "total_km" in res.json()

def test_total_km_by_district():
    res = requests.get(f"{BASE_URL}/participation/total_km/district/Lisbon")
    assert res.status_code == 200
    assert "total_km" in res.json()

def test_total_km_by_municipality():
    res = requests.get(f"{BASE_URL}/participation/total_km/municipality/Lisboa")
    assert res.status_code == 200
    assert "total_km" in res.json()
