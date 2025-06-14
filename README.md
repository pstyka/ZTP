# Uruchomienie aplikacji
Aby uruchomić aplikację, wykonaj poniższe kroki:

Wpisz komendę w terminalu:
```bash
docker compose up --build
```

Otwórz przeglądarkę i przejdź do adresu `http://localhost:4200/`. Aplikacja powinna być dostępna pod tym adresem.

## Opis projektu
Aplikacja internetowa do sprzedaży i wynajmu mieszkań z funkcjonalnościami czatu w czasie rzeczywistym oraz integracją z mapami.

## Technologie

### Frontend
- **Angular** - framework do budowy interfejsu użytkownika
- **NgRx Store** - zarządzanie stanem aplikacji
- **WebSockets** - komunikacja w czasie rzeczywistym
- **External Maps API** - integracja z mapami

### Backend
- **Mikroserwisy** napisane w **Python** i **Java**
- **API Gateway** - punkt wejścia dla requestów, autoryzacja, przekierowania, rate limiter, cache
- **Users** - mikroserwis do zarządzania użytkownikami, chat, wiadomości
- **restapi** - mikroserwis do zarządzania mieszkaniami, integracja z mapami

### Bazy danych
- **PostgreSQL** - główna baza danych
- **Redis** - cache i rate limiting użytkowników po ip

### Infrastruktura
- **Docker** - konteneryzacja wszystkich komponentów
- **Docker Compose** - orkiestracja środowiska

## Funkcjonalności
- **Zarządzanie mieszkaniami** - dodawanie, wyświetlanie, edycja i usuwanie ofert
- **System wiadomości** - wysyłanie wiadomości między użytkownikami w czasie rzeczywistym
- **Autentykacja i autoryzacja** - bezpieczne logowanie i zarządzanie użytkownikami
- **cache** - optymalizacja wydajności poprzez Redis
- **Rate Limiting** - ograniczenie liczby requestów do API na użytkownika (wyłączone)

## Wzorce projektowe

### Frontend
- **Subscription Pattern** - reaktywne zarządzanie danymi
- **NgRx Store Pattern** - centralne zarządzanie stanem aplikacji

### Backend
- **Dependency Injection** - luźne powiązanie komponentów
- **Singleton Pattern** - zarządzanie jedynymi instancjami serwisów
- **Caching Strategy** - optymalizacja wydajności poprzez Redis
- **Rate Limiting** - ograniczenie liczby requestów do API na użytkownika (wyłączone)
- **API Gateway Pattern** - centralny punkt wejścia do mikroserwisów
- **Repository Pattern** - abstrakcja dostępu do danych