# MzansiBuilds — Build in Public Platform

A full-stack platform where developers build publicly, track milestones, collaborate, and celebrate completed projects.

Built for the **Derivco Code Skills Challenge**.

---

## Architecture

```
┌─────────────────────────────────┐     ┌──────────────────────────────────────┐
│   React 18 + Vite (port 5173)   │────▶│  Spring Boot 2.7 API (port 8080/api) │
│   Tailwind CSS, React Router v6 │◀────│  Java 17, JPA/H2, BCrypt, JWT        │
│   Axios, React Context API      │     │  JavaMailSender (Gmail SMTP)          │
└─────────────────────────────────┘     └──────────────────────────────────────┘
```

### Backend (`MzansiBuilds01BACKEND/`)

| Layer | Technology |
|---|---|
| Framework | Spring Boot 2.7.18 |
| Language | Java 17 |
| Security | JWT (jjwt 0.11.5), BCryptPasswordEncoder, stateless sessions |
| Persistence | Spring Data JPA, H2 in-memory database |
| Email | Spring Mail (Gmail SMTP) |
| Build | Maven 3 |

### Frontend (`MZANSIBUILDS FRONEND/`)

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS (green / white / black theme) |
| HTTP client | Axios (JWT interceptor for auth header) |
| State | React Context API (AuthContext, ProjectContext) |
| Testing | Vitest + React Testing Library |

---

## Features

- **Account Management** — Register, login, JWT-secured sessions, forgot/reset password via email
- **Project Creation** — Create projects with stages, tech stack, and support requirements
- **Live Feed** — Public feed of all projects; no login required to browse
- **Collaboration** — Comment on projects and raise hands for collaboration requests
- **Milestone Tracking** — Add progress updates to mark project stages
- **Celebration Wall** — Showcase completed projects

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Create developer account |
| POST | `/api/login` | Public | Login, returns JWT |
| POST | `/api/forgot-password` | Public | Send password-reset email |
| POST | `/api/reset-password` | Public | Reset password using token |
| GET | `/api/projects` | Public | List all projects |
| GET | `/api/projects/{id}` | Public | Get single project |
| POST | `/api/projects` | Auth | Create project |
| PUT | `/api/projects/{id}` | Auth | Edit project |
| DELETE | `/api/projects/{id}` | Auth | Delete project |
| GET | `/api/comment/{projectId}` | Public | Get project comments |
| POST | `/api/comment` | Auth | Add comment |
| GET | `/api/progress/{projectId}` | Public | Get progress updates |
| POST | `/api/progress` | Auth | Add progress update |
| GET | `/api/developers/all` | Public | List all developers |

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

### Backend

```bash
cd MzansiBuilds01BACKEND
mvn clean spring-boot:run
# API available at http://localhost:8080/api
```

### Frontend

```bash
cd "MZANSIBUILDS FRONEND"
npm install
npm run dev
# App available at http://localhost:5173
```

### Run Tests

```bash
# Frontend unit tests
cd "MZANSIBUILDS FRONEND"
npm test

# Backend tests
cd MzansiBuilds01BACKEND
mvn test
```

### Build for Production

```bash
# Frontend
npm run build

# Backend (produces executable JAR)
mvn clean package
```

---

## Project Structure

```
DERIVCO MZANSI BUILDS/
├── MzansiBuilds01BACKEND/          # Spring Boot API
│   ├── src/main/java/za/ac/mzansibuilds/
│   │   ├── config/                 # Security, CORS, JWT filter
│   │   ├── controllers/            # REST endpoints
│   │   ├── domain/                 # JPA entities
│   │   ├── dto/                    # Request/response DTOs
│   │   ├── repository/             # Spring Data repositories
│   │   ├── service/                # Business logic
│   │   └── util/                   # JwtUtil
│   └── src/main/resources/
│       └── application.properties
│
├── MZANSIBUILDS FRONEND/           # React + Vite SPA
│   └── src/
│       ├── components/             # Navbar, Footer, ProjectCard, Layout
│       ├── context/                # AuthContext, ProjectContext
│       ├── pages/                  # All page components
│       ├── services/               # Axios API wrappers
│       └── tests/                  # Vitest unit tests
│
├── .github/workflows/ci.yml        # CI/CD: Maven + Vite builds on push
└── architecture.puml               # PlantUML architecture diagram
```

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request:

- **Backend job**: JDK 17, `mvn -B clean verify`
- **Frontend job**: Node 20, `npm ci && npm run build`

---

## Security

- Passwords hashed with BCrypt (never stored or returned in plaintext)
- JWT access tokens (24h expiry, HS256)
- Separate short-lived reset tokens (1h) with `type=reset` claim guard
- Password not serialised in any API response (`@JsonIgnore`)
- CORS restricted to `localhost:5173`, `localhost:3000`, `localhost:5174`
- Stateless server sessions (no server-side session storage)

---

## Design Theme

- Primary: Green (`#10b981`)
- Background: White (`#ffffff`)
- Accent: Black (`#000000`)
- Professional, clean UI with bold borders and clear typography

---

## License

MIT

## Author

Built for the Derivco Code Skills Challenge
