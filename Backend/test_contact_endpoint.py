import requests
import json

# Test data
test_data = {
    "name": "Test User",
    "email": "test@example.com", 
    "message": "This is a test message from Python script",
    "organization": "Test Company",
    "phone": "+1234567890",
    "service": "Software Engineering Services"
}

# First test the root endpoint to make sure server is running
print("Testing root endpoint...")
try:
    root_response = requests.get("http://localhost:10000/")
    print(f"Root Status: {root_response.status_code}")
    print(f"Root Response: {root_response.text}")
except Exception as e:
    print(f"Error connecting to root: {e}")
    exit(1)

print("\n" + "="*50)
print("Testing contact endpoint...")

# Make the request to the contact endpoint
try:
    response = requests.post(
        "http://localhost:10000/api/contact/",  # Added trailing slash
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("✅ SUCCESS: Contact form submission worked!")
    else:
        print(f"❌ ERROR: Request failed with status {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Could not connect to the server. Make sure the backend is running on port 10000")
except Exception as e:
    print(f"❌ ERROR: {str(e)}") 