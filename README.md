# Uruchomienie aplikacji
Aby uruchomić aplikację, wykonaj poniższe kroki:

Wpisz komendę w terminalu:
```bash
docker compose up --build
```
Aby uruchomić clienta, wpisz:
```bash
npm install 
ng serve
```

## Dokumentacja REST_API (SWAGGER)

```
http://localhost:8080/swagger-ui.html
```

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

## Pobranie swoich danych
```
curl -X GET "http://127.0.0.1:8000/api/v1/users/me" \
-H "Authorization: Bearer <token>"
```


## chat - sockety - messages

Wszystkie requesty idą przez API Gateway z prefiksem `/api/v1/chat`

### Autoryzacja
Wszystkie endpointy wymagają JWT token w headerze:
```
Authorization: Bearer <your-jwt-token>
```
---

## 📨 Wysyłanie wiadomości

**POST** `/api/v1/chat/messages`

```json
{
  "receiver_id": "uuid-odbiorcy",
  "content": "Treść wiadomości"
}
```

**Odpowiedź:**
```json
{
  "id": "uuid-wiadomosci",
  "sender_id": "uuid-nadawcy",
  "receiver_id": "uuid-odbiorcy", 
  "sender_name": "Jan Kowalski",
  "receiver_name": "Anna Nowak",
  "content": "Treść wiadomości",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

## 💬 Pobieranie konwersacji

**GET** `/api/v1/chat/messages/{user_id}`

Pobiera wszystkie wiadomości między Tobą a użytkownikiem `{user_id}`.

**Odpowiedź:** Lista wiadomości posortowana chronologicznie.

---

## 📋 Lista konwersacji

**GET** `/api/v1/chat/conversations`

Pobiera listę wszystkich Twoich konwersacji z ostatnimi wiadomościami.

**Odpowiedź:**
```json
[
  {
    "user_id": "uuid-rozmowcy",
    "user_name": "Jan Kowalski", 
    "last_message": "Ostatnia wiadomość...",
    "last_message_time": "2025-01-15T10:30:00Z"
  }
]
```

---

## 🔄 Real-time WebSocket

**WebSocket** `/api/v1/chat/ws/{user_id}`

Automatycznie otrzymujesz nowe wiadomości w czasie rzeczywistym.

**Format wiadomości WebSocket:**
```json
{
  "id": "uuid-wiadomosci",
  "sender_id": "uuid-nadawcy",
  "receiver_id": "uuid-odbiorcy",
  "sender_name": "Jan Kowalski", 
  "receiver_name": "Anna Nowak",
  "content": "Treść wiadomości",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

##  Testowanie

```bash
# Wyślij wiadomość
curl -X POST "http://localhost:8000/api/v1/chat/messages" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_id": "uuid-odbiorcy",
    "content": "Testowa wiadomość"
  }'

# Pobierz konwersację  
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8000/api/v1/chat/messages/uuid-rozmowcy"

# Pobierz listę konwersacji
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8000/api/v1/chat/conversations"
```

### 3. Test WebSocket (JavaScript)

```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/chat/ws/your-user-id');

ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log('Nowa wiadomość:', message);
};
```