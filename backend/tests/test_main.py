import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_process_data():
    # Test case for MarketGPT option
    data = {
        "option": "MarketGPT",
        "value": "OpenAI"
    }
    response = client.post("/", json=data)
    assert response.status_code == 200
    assert "Organization" in response.json()["value"]

    # Test case for Personalized Email Outreach option
    data = {
        "option": "Personalized Email Outreach",
        "value": "Hello, how are you?"
    }
    response = client.post("/", json=data)
    assert response.status_code == 200
    assert "value" in response.json()

    # Test case for Social Media Posting option
    data = {
        "option": "Social Media Posting",
        "value": "Check out our new product!"
    }
    response = client.post("/", json=data)
    assert response.status_code == 200
    assert "value" in response.json()

    # Test case for invalid option
    data = {
        "option": "Invalid Option",
        "value": "Test prompt"
    }
    response = client.post("/", json=data)
    assert response.status_code == 200
    assert response.json()["value"] == "Error"

def test_get_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello. This is the backend!"}
