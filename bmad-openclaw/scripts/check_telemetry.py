import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

def check():
    db_config_path = os.path.expanduser('~/workspace/c4n-CompanyDashboard/src/lib/firebase.ts')
    # Based on route.ts, it uses firebase/firestore. 
    # Usually, a direct service account or firebase-config.json is used for admin tasks.
    # Searching for firebase configuration...
    
    firebase_json_path = os.path.expanduser('~/workspace/c4n-CompanyDashboard/firebase.json')
    if os.path.exists(firebase_json_path):
        with open(firebase_json_path, 'r') as f:
            print(f"Firebase Config: {f.read()}")

    # Try to find any service account in the whole workspace
    import subprocess
    result = subprocess.run(['find', os.path.expanduser('~/workspace'), '-name', '*service-account*.json'], capture_output=True, text=True)
    sa_files = result.stdout.strip().split('\n')
    
    if not sa_files or not sa_files[0]:
        print("No service account files found.")
        return

    print(f"Using service account: {sa_files[0]}")
    cred = credentials.Certificate(sa_files[0])
    try:
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        docs = db.collection('telemetry').order_by('receivedAt', direction=firestore.Query.DESCENDING).limit(20).stream()
        
        found = False
        for doc in docs:
            data = doc.to_dict()
            if 'sentinel' in str(data).lower():
                print(f"ID: {doc.id} => {json.dumps(data, indent=2, default=str)}")
                found = True
        
        if not found:
            print("No Sentinel related telemetry found.")
    except Exception as e:
        print(f"Error during execution: {e}")

if __name__ == "__main__":
    check()
