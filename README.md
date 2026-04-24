# Project Hotel

Project Hotel is a full-stack vacation management system built with `React`, `TypeScript`, `Node.js`, `Express`, `MySQL`, and `Docker`.  
The application supports authentication, role-based authorization, vacation management, likes, reports, AI-powered travel recommendations, and MCP-based vacation Q&A.

Repository:

- `https://github.com/rest72611-lang/project-hotel`

## Main Features

- User registration and login with `JWT`
- Role-based access: `user` and `admin`
- Vacation listing with destination, description, dates, price, image, likes count, and liked status
- Admin management:
  - add vacation
  - edit vacation
  - delete vacation
- User interactions:
  - like vacation
  - unlike vacation
  - filter vacations
- Admin likes report with chart + CSV export
- AI travel recommendation endpoint
- MCP-backed AI question flow for vacation-related questions
- Dockerized local environment for frontend, backend, and database

## Tech Stack

Frontend:

- `React`
- `TypeScript`
- `Vite`
- `React Router`
- `React Hook Form`
- `Axios`
- `Recharts`
- `Notyf`

Backend:

- `Node.js`
- `Express`
- `TypeScript`
- `MySQL2`
- `JWT`
- `bcryptjs`
- `Joi`
- `Zod`
- `OpenAI SDK`
- `express-fileupload`
- `express-rate-limit`
- `MCP`

Infrastructure:

- `Docker`
- `Docker Compose`
- `MySQL 8`
- `Nginx`

## Project Structure

- `Database` - database creation script and seed data
- `Backend` - REST API, business logic, middleware, AI and MCP services
- `Frontend` - React client application
- `Backend/Postman` - exported Postman collections and environments

## Architecture Notes

Backend is organized into clear layers:

- `controllers` - HTTP handling
- `services` - business logic
- `middleware` - authentication, authorization, and error handling
- `utils` - shared infrastructure helpers
- `models` - validation, enums, and typed contracts

Frontend is organized around:

- page components
- layout components
- API services
- typed models
- shared utilities

## Run With Docker

From the project root:

```powershell
docker compose up -d --build
```

Current local ports:

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:4001`
- MySQL: `localhost:3308`

## Demo Credentials

Admin user seeded by the database script:

```text
email: admin@admin.com
password: admin
```

## Environment Variables

The backend expects environment variables such as:

- `OPENAI_API_KEY`
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `JWT_SECRET`

Do not commit personal `.env` files or API keys.

## Security Notes

- JWT tokens are used for authentication
- Admin routes are protected in both frontend flow and backend middleware
- AI outputs are validated before use where relevant
- CSP and additional response security headers are configured in the frontend `nginx.conf`
- The app avoids rendering raw HTML from AI/user responses in the UI

## API Highlights

Main backend route groups:

- `/api/auth`
- `/api/vacations`
- `/api/likes`
- `/api/recommendations`
- `/api/ai/ask`
- `/api/ping`
- `/mcp`

## Notes For Evaluation

This project goes beyond a basic CRUD system by including:

- role-based authorization
- image upload handling
- likes aggregation
- reporting
- Dockerized deployment
- AI recommendation flow
- MCP integration
