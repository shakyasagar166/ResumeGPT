def test_optimize_bullet_point(client, auth_user):
    headers = auth_user["headers"]
    res = client.post(
        "/api/agents/optimize-bullet",
        json={
            "bullet_point": "worked on databases and fixed some bugs",
            "target_role": "Backend Engineer"
        },
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "improved_versions" in data
    assert len(data["improved_versions"]) >= 1
    assert "critique" in data
