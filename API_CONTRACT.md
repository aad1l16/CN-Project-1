# SafeSpeak API Contract (`/api/v1`)

All error responses (`400`, `401`, `403`, `404`, `500`) return: `{"error": "<message>"}`.
Auth uses an `HttpOnly`, `Secure`, `SameSite=Lax` JWT cookie (`credentials: "include"`).

- `GET /api/v1/health` -> `200`: `{"status": "ok", "hostname": "bscs25058-api", "ip": "192.168.58.20", "db_reachable": true}`
- `POST /api/v1/auth/register` | Body: `{"username", "password"}` -> `201`: `{"message", "user": {"id", "username", "role"}}`
- `POST /api/v1/auth/login` | Body: `{"username", "password"}` -> `200`: `{"message", "user": {"id", "username", "role"}}` (sets JWT cookie)
- `GET /api/v1/auth/me` -> `200`: `{"id", "username", "role"}`
- `POST /api/v1/auth/change-password` | Body: `{"old_password", "new_password"}` -> `200`: `{"message"}`
- `POST /api/v1/auth/logout` -> `200`: `{"message"}` (clears JWT cookie)
- `GET /api/v1/feedback` -> `200`: `{"feedback": [{"id", "course_code", "rating", "feedback_text", "created_at"}]}`
- `POST /api/v1/feedback` | Body: `{"course_code", "rating", "feedback_text"}` -> `201`: `{"id", "course_code", "rating", "feedback_text", "created_at"}` (`feedback_text` encrypted at rest)
- `DELETE /api/v1/feedback/<id>` (`admin` role only) -> `200`: `{"message"}` (`403` for `user`)
