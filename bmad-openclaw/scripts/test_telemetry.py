# RED Testing - Story 2.3 Task 3
# Verify if Sentinel can reach the dashboard telemetry API

import requests
import json

def test_telemetry_link():
    url = "http://localhost:3000/api/telemetry"
    payload = {
        "node": "SENTINEL_PROD",
        "event": "SECURITY_SCAN_COMPLETED",
        "status": "VERIFIED",
        "load": "12%"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 202
    except Exception as e:
        print(f"Connection Failed: {e}")
        return False

if __name__ == "__main__":
    test_telemetry_link()
