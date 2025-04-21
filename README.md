## Tworzenie użytkownika
```
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password_hash": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "123456789"
}'
```
## tworzenie tokenu
```
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/auth/token' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password&username=user%40example.com&password=string'
```

# Pobranie swoich danych
```
curl -X GET "http://127.0.0.1:8000/api/v1/users/me" \
-H "Authorization: Bearer <token>"
```

