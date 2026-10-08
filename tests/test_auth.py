def test_register_and_login(client):
    res = client.post(
        "/api/auth/register",
        json={
            "email": "shivam_jobseeker@resumegpt.ai",
            "username": "shivam_dev",
            "password": "strongPassword123"
        }
    )
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "shivam_jobseeker@resumegpt.ai"
    assert data["username"] == "shivam_dev"

    login_res = client.post(
        "/api/auth/login",
        data={"username": "shivam_dev", "password": "strongPassword123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    profile_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert profile_res.status_code == 200
    assert profile_res.json()["username"] == "shivam_dev"
