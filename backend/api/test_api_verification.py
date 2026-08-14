import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
import django
django.setup()

# Allow the Django test client host in any environment
from django.conf import settings as django_settings
if 'testserver' not in django_settings.ALLOWED_HOSTS:
    django_settings.ALLOWED_HOSTS = list(django_settings.ALLOWED_HOSTS) + ['testserver', 'localhost', '127.0.0.1']

from django.test import Client
from api.models import SiteSetting, ContactMessage

client = Client()

results = {}

def run_tests():
    print("==================================================")
    print("PHASE 4: FULL API VERIFICATION TEST SUITE")
    print("==================================================")

    # 1. Health Endpoint
    res = client.get('/api/health/')
    assert res.status_code == 200
    data = res.json()
    assert data.get('status') == 'healthy'
    assert 'services' in data
    print("[PASS] GET /api/health/ -> 200 OK (Healthy payload verified)")
    results['health'] = "200 OK"

    # 2. Profile Endpoint
    res = client.get('/api/profile/')
    assert res.status_code == 200
    data = res.json()
    assert data.get('name') == "Suryakiran P. J."
    print("[PASS] GET /api/profile/ -> 200 OK (Profile payload verified)")
    results['profile'] = "200 OK"

    # 3. Projects Endpoint
    res = client.get('/api/projects/')
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list) and len(data) >= 1
    print(f"[PASS] GET /api/projects/ -> 200 OK ({len(data)} projects returned)")
    results['projects'] = f"200 OK ({len(data)} projects)"

    # 4. Skills Endpoint
    res = client.get('/api/skills/')
    assert res.status_code == 200
    data = res.json()
    assert 'all' in data and 'grouped' in data
    print("[PASS] GET /api/skills/ -> 200 OK (Categorized skills payload verified)")
    results['skills'] = "200 OK"

    # 5. Experience Endpoint
    res = client.get('/api/experience/')
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    print(f"[PASS] GET /api/experience/ -> 200 OK ({len(data)} experience items returned)")
    results['experience'] = f"200 OK ({len(data)} items)"

    # 6. Education Endpoint
    res = client.get('/api/education/')
    assert res.status_code == 200
    data = res.json()
    assert 'education' in data and 'certifications' in data
    print("[PASS] GET /api/education/ -> 200 OK (Education & certifications verified)")
    results['education'] = "200 OK"

    # 7. Services Endpoint
    res = client.get('/api/services/')
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list) and len(data) >= 1
    print(f"[PASS] GET /api/services/ -> 200 OK ({len(data)} services returned)")
    results['services'] = f"200 OK ({len(data)} services)"

    # 8. Social Links Endpoint
    res = client.get('/api/social-links/')
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list) and len(data) >= 1
    print(f"[PASS] GET /api/social-links/ -> 200 OK ({len(data)} social links returned)")
    results['social_links'] = f"200 OK ({len(data)} links)"

    # 9. Contact Submission Endpoint (Valid & Invalid Input)
    invalid_res = client.post('/api/contact/', data=json.dumps({"name": "A"}), content_type='application/json')
    assert invalid_res.status_code == 400
    print("[PASS] POST /api/contact/ -> 400 BAD REQUEST (Invalid input validation passed)")

    valid_payload = {
        "name": "Audit Verification Test",
        "email": "audit@verification.com",
        "subject": "System Verification Test",
        "message": "Testing contact API validation and record persistence."
    }
    valid_res = client.post('/api/contact/', data=json.dumps(valid_payload), content_type='application/json')
    assert valid_res.status_code == 201
    assert ContactMessage.objects.filter(email="audit@verification.com").exists()
    print("[PASS] POST /api/contact/ -> 201 CREATED (Contact message saved to DB verified)")
    results['contact'] = "201 CREATED"

    # 10. AI Chat Endpoint (Standard, Recruiter, Client, Developer modes)
    res_std = client.post('/api/ai/chat/', data=json.dumps({"message": "Who is Suryakiran?", "mode": "STANDARD"}), content_type='application/json')
    assert res_std.status_code == 200
    assert 'answer' in res_std.json()

    res_rec = client.post('/api/ai/chat/', data=json.dumps({"message": "Recruiter summary", "mode": "RECRUITER"}), content_type='application/json')
    assert res_rec.status_code == 200
    assert res_rec.json().get('mode') == 'RECRUITER'

    res_cli = client.post('/api/ai/chat/', data=json.dumps({"message": "Client scope", "mode": "CLIENT"}), content_type='application/json')
    assert res_cli.status_code == 200
    assert res_cli.json().get('mode') == 'CLIENT'

    res_dev = client.post('/api/ai/chat/', data=json.dumps({"message": "Developer breakdown", "mode": "DEVELOPER"}), content_type='application/json')
    assert res_dev.status_code == 200
    assert res_dev.json().get('mode') == 'DEVELOPER'
    print("[PASS] POST /api/ai/chat/ -> 200 OK (Standard, Recruiter, Client, and Developer modes verified)")
    results['ai_chat'] = "200 OK (All 4 modes verified)"

    # 11. Privacy Mode Shielding Verification
    setting = SiteSetting.objects.get(id=1)
    setting.privacy_mode = 'PRIVATE'
    setting.save()

    priv_res = client.get('/api/profile/')
    assert priv_res.status_code == 503
    assert priv_res.json().get('system_mode') == 'PRIVATE'
    print("[PASS] Backend Privacy Mode Shielding -> 503 SERVICE UNAVAILABLE (Private mode API enforcement verified)")

    # Restore Public Mode
    setting.privacy_mode = 'PUBLIC'
    setting.save()

    print("\nAPI VERIFICATION SUCCESSFUL! All 10 core endpoints verified.")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
