# PGT

A web platform for finding teammates to play games with. Users create a profile, search for players by genre, free time and other criteria, chat with them in real time and receive notifications through a Telegram bot.

## Features

- **Profiles.** Create a profile with your games, genres, availability and other details.
- **Teammate search.** Find players by genre, free time and [other filters, e.g. platform, language, skill level].
- **Chat.** Message other players directly in the app.
- **Telegram notifications.** A Telegram bot notifies you about new messages and [matches / requests].
- **Authentication.** [Registration and login, JWT].

## Architecture

The project is split into independent microservices behind a single API gateway:

| Service | Responsibility |
|---------|----------------|
| `api-gateway` | Single entry point, routes requests to services |
| `auth-service` | Registration, login, authentication |
| `profile-service` | User profiles and their settings |
| `matchmaking-service` | Teammate search and filtering |
| `chat-service` | Messaging between users |
| `notification-service` | Notifications via the Telegram bot |
| `frontend` | Web interface |


## Tech Stack

- **Backend:** [Java Spring Boot / Node.js / Python FastAPI]
- **Frontend:** [React / Vue / plain HTML+JS]
- **Database:** [PostgreSQL / MongoDB]
- **Messaging between services:** [REST]
- **Real-time chat:** [WebSocket]
- **Notifications:** Telegram Bot API
- **Infrastructure:** Docker, Docker Compose

## Context

University project for the course "Webové aplikace: backend", Mendel University in Brno, 2025/2026.

## Authors

Anton Simikin

