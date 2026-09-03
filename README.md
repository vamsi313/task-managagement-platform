# Task Management Platform 📋🚀

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-blue.svg)](https://spring.io/projects/spring-security)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A student-level, resume-ready **Task Management Platform** engineered with modern industry practices. Features a secure, stateless **Spring Boot** backend, **PostgreSQL** relational database with JPA/Hibernate, and an interactive **React + Vite** frontend.

---

## 📖 Table of Contents
- [Why This Project?](#-why-this-project)
- [What It Does (Core Features)](#-what-it-does-core-features)
- [Tech Stack & Engineering Rationale](#-tech-stack--engineering-rationale)
- [Application Architecture](#-application-architecture)
- [Security & Authentication Mechanism](#-security--authentication-mechanism)
- [Database Schema & Relationships](#-database-schema--relationships)
- [REST API Catalog](#-rest-api-catalog)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Sample API Payloads](#-sample-api-payloads)
- [College Interview Q&A Talking Points](#-college-interview-qa-talking-points)

---

## 💡 Why This Project?

Modern software development demands robust full-stack skills: secure authentication, access control, clean API structure, and reactive client state management. 

This project was built to demonstrate:
1. **Production-Ready Security Standards**: Implementing JSON Web Tokens (JWT) and BCrypt hashing with Spring Security instead of basic or session-cookie auth.
2. **True Layered Architecture**: Clear separation of concerns across Presentation (React Components), API/Controller layer, Business/Service layer, and Persistence (Spring Data JPA) layer.
3. **Role-Based Access Control (RBAC)**: Distinguishing fine-grained permissions between regular `USER`s and system `ADMIN`s.
4. **Relational Data Modeling**: Modeling real-world Many-to-One ownership and assignment associations between users and tasks.

---

## 🎯 What It Does (Core Features)

- **User Authentication**: Secure Sign Up, Login, and Stateless Logout.
- **JWT Authorization**: All task endpoints require a valid Bearer Token; invalid or expired tokens are blocked gracefully.
- **Task Management (Full CRUD)**:
  - Create tasks with Title, Description, Priority (`LOW`, `MEDIUM`, `HIGH`), Due Date, and Assignee.
  - View accessible tasks in an intuitive card layout.
  - Quick inline status switcher (`TODO` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
  - Update any field with live validation.
  - Delete tasks (creator and admin permissions).
- **Team Task Assignment**: Dynamically fetch all registered users to assign team responsibilities.
- **Interactive Dashboard**:
  - Live metric summary cards (**Total Accessible Tasks**, **To Do**, **In Progress**, **Completed**).
  - Quick filter chips: *All Tasks*, *Assigned to Me*, *Created by Me*.
  - Status dropdown filters.
- **Responsive UI/UX**: Lightweight, responsive Vanilla CSS designed without heavyweight bulky libraries.

---

## 🛠️ Tech Stack & Engineering Rationale

### Frontend
- **React 18**: Component-based UI, hooks (`useState`, `useEffect`), and reactive state.
- **Vite 5**: Next-generation bundling and lightning-fast Hot Module Replacement (HMR).
- **React Router v6**: Client-side navigation with route guards via `<ProtectedRoute>`.
- **Vanilla CSS (CSS3 Variables & Grid)**: Zero bloat, responsive layout on desktop, tablet, and mobile.
- **Fetch API**: Native promise-based HTTP client with dynamic Bearer token interception.

### Backend
- **Java 17**: Long-Term Support (LTS) modern Java features.
- **Spring Boot 3.2.x**: Enterprise-grade framework for micro-ready REST services.
- **Spring Security 6**: Stateless security filter chain with customized `OncePerRequestFilter`.
- **JJWT (Java JWT)**: Industry standard HS256 token creation, parsing, and claim extraction.
- **Spring Data JPA & Hibernate**: Object-Relational Mapping (ORM), JPQL custom queries, and automated schema migration.
- **Jakarta Bean Validation**: Input validation annotations (`@NotBlank`, `@Email`, `@Size`, `@NotNull`).
- **Maven**: Build tool and dependency manager.

### Database
- **PostgreSQL**: Enterprise-grade relational SQL database with ACID guarantees and foreign key constraints.

---

## 🏗️ Application Architecture

```
                               ┌─────────────────────────┐
                               │     React Client        │
                               │   (Vite, React Router)  │
                               └────────────┬────────────┘
                                            │ HTTP / JSON
                                            │ + Authorization: Bearer <JWT>
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Spring Boot Application                             │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         Spring Security Filter                          │   │
│   │               [ CorsFilter ──► JwtAuthenticationFilter ]                │   │
│   └────────────────────────────────────┬────────────────────────────────────┘   │
│                                        │ Populates SecurityContextHolder        │
│                                        ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         REST Controller Layer                           │   │
│   │          AuthController   │   TaskController   │   UserController       │   │
│   └────────────────────────────────────┬────────────────────────────────────┘   │
│                                        │ DTOs (Request / Response)              │
│                                        ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         Service / Business Layer                        │   │
│   │            AuthService    │    TaskService     │    UserService         │   │
│   │                     (Access Control & Permission Checks)                │   │
│   └────────────────────────────────────┬────────────────────────────────────┘   │
│                                        │ Domain Models (User, Task)             │
│                                        ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                       Data Access / JPA Layer                           │   │
│   │               UserRepository       │       TaskRepository               │   │
│   └────────────────────────────────────┬────────────────────────────────────┘   │
└────────────────────────────────────────┼────────────────────────────────────────┘
                                         │ Hibernate ORM
                                         ▼
                               ┌─────────────────────────┐
                               │   PostgreSQL Database   │
                               │    (users, tasks)       │
                               └─────────────────────────┘
```

---

## 🔐 Security & Authentication Mechanism

```
  [ Client (React) ]                      [ Spring Boot Backend ]                [ PostgreSQL ]
          │                                          │                                  │
          │ 1. POST /api/auth/signup                 │                                  │
          ├─────────────────────────────────────────►│ 2. BCrypt.hash(password)        │
          │                                          ├─────────────────────────────────►│
          │                                          │    Save User with ROLE_USER      │
          │                                          │                                  │
          │ 3. POST /api/auth/login                  │                                  │
          ├─────────────────────────────────────────►│ 4. Verify password hash          │
          │                                          │ 5. Generate Signed JWT Token     │
          │◄─────────────────────────────────────────┤                                  │
          │    { token, user: { id, name, role } }   │                                  │
          │                                          │                                  │
          │ 6. Store JWT in LocalStorage             │                                  │
          │                                          │                                  │
          │ 7. GET /api/tasks [Bearer <token>]       │                                  │
          ├─────────────────────────────────────────►│ 8. Validate JWT Signature & Exp  │
          │                                          │ 9. Set Authentication Context    │
          │                                          ├─────────────────────────────────►│
          │                                          │    Fetch Accessible Tasks        │
          │◄─────────────────────────────────────────┤                                  │
          │    Return Task List JSON                 │                                  │
```

### Security Highlights:
- **No Plaintext Passwords**: Cryptographically salted and hashed using `BCryptPasswordEncoder`.
- **Stateless Session Management**: `SessionCreationPolicy.STATELESS` eliminates server-side session overhead.
- **Configurable Secrets**: JWT secret and database credentials are fully externalized to environment/properties.
- **CORS Configured**: Cross-Origin Resource Sharing securely configured for React development origin `http://localhost:5173`.

---

## 🗄️ Database Schema & Relationships

### 1. `users` Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP NOT NULL
);
```

### 2. `tasks` Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
    due_date DATE,
    created_by BIGINT NOT NULL REFERENCES users(id),
    assigned_to BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

---

## 📡 REST API Catalog

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user | Public |
| `POST` | `/api/auth/login` | Authenticate & get JWT | Public |
| `POST` | `/api/auth/logout` | Client stateless logout | Authenticated |
| `GET` | `/api/users` | Get user list for task assignment | Authenticated |
| `GET` | `/api/tasks` | Get tasks accessible to current user | Authenticated |
| `GET` | `/api/tasks/{id}` | Get single task details | Creator / Assignee / Admin |
| `POST` | `/api/tasks` | Create new task (Creator set to logged user) | Authenticated |
| `PUT` | `/api/tasks/{id}` | Update task details & assignment | Creator / Assignee / Admin |
| `PATCH`| `/api/tasks/{id}/status` | Quick status update (`TODO`/`IN_PROGRESS`/`COMPLETED`) | Creator / Assignee / Admin |
| `DELETE`| `/api/tasks/{id}` | Delete task | Creator / Admin |

---

## 📁 Project Directory Structure

```
TASK MANAGEMEN PLATFORM/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/taskmgmt/
│       │   ├── TaskManagementApplication.java
│       │   ├── config/
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── TaskController.java
│       │   │   └── UserController.java
│       │   ├── dto/
│       │   │   ├── ApiResponse.java
│       │   │   ├── AuthResponse.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── SignupRequest.java
│       │   │   ├── TaskRequest.java
│       │   │   ├── TaskResponse.java
│       │   │   ├── TaskStatusUpdateRequest.java
│       │   │   ├── TaskUpdateRequest.java
│       │   │   └── UserSummaryDto.java
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── ResourceNotFoundException.java
│       │   │   └── UnauthorizedException.java
│       │   ├── model/
│       │   │   ├── Role.java
│       │   │   ├── Task.java
│       │   │   ├── TaskPriority.java
│       │   │   ├── TaskStatus.java
│       │   │   └── User.java
│       │   ├── repository/
│       │   │   ├── TaskRepository.java
│       │   │   └── UserRepository.java
│       │   ├── security/
│       │   │   ├── CustomUserDetailsService.java
│       │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   ├── JwtAuthenticationFilter.java
│       │   │   ├── JwtTokenProvider.java
│       │   │   ├── SecurityConfig.java
│       │   │   └── UserPrincipal.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── TaskService.java
│       │       └── UserService.java
│       └── resources/
│           └── application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── TaskCard.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateTask.jsx
│       │   ├── EditTask.jsx
│       │   └── TaskDetails.jsx
│       └── services/
│           └── api.js
└── README.md
```

---

## ⚡ Getting Started & Local Setup

### Prerequisites
- **Java 17+**
- **Node.js 18+ & npm**
- **PostgreSQL 14+**
- **Maven** (or IDE embedded Maven)

### 1. Database Setup
Create database in PostgreSQL:
```sql
CREATE DATABASE taskmanagement;
```

### 2. Configure Backend Credentials
In `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanagement
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD

app.jwt.secret=9a67c57b8593a32f6b3e9a1b4c7d8e2f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d
```

### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
```
Backend API will start at **http://localhost:8080**.

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend web application will open at **http://localhost:5173**.

---

## 📋 Sample API Payloads

### 1. User Registration
`POST http://localhost:8080/api/auth/signup`
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123"
}
```

### 2. User Login
`POST http://localhost:8080/api/auth/login`
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsIm5hbWUiOiJBbGljZSBKb2huc29uIi...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "USER"
  }
}
```

### 3. Create Task
`POST http://localhost:8080/api/tasks`  
*Header:* `Authorization: Bearer <token>`
```json
{
  "title": "Build Spring Security JWT Filter",
  "description": "Configure OncePerRequestFilter, BCrypt password encoder, and stateless sessions.",
  "priority": "HIGH",
  "dueDate": "2026-09-20",
  "assignedTo": 2
}
```

### 4. Update Task Status
`PATCH http://localhost:8080/api/tasks/1/status`  
*Header:* `Authorization: Bearer <token>`
```json
{
  "status": "IN_PROGRESS"
}
```

---

## 🎓 College Interview Q&A Talking Points

### Q1: Why did you choose JWT over traditional server sessions?
> **Answer**: Traditional sessions store session IDs in server memory, requiring sticky sessions or shared distributed session caches (like Redis) when scaling out horizontally. JWT is stateless: all identity claims are signed cryptographically in the token payload. Any instance of the backend can verify the signature independently, making it lightweight and horizontally scalable.

### Q2: How is role-based access control (RBAC) enforced?
> **Answer**: We enforce RBAC at both the Spring Security filter chain and the Service layer. In `TaskService`, permission checks verify whether the requester's ID matches `task.getCreatedBy()` or `task.getAssignedTo()`. If an `ADMIN` role is detected, broader viewing and deletion privileges are granted.

### Q3: How do you prevent SQL Injection and unauthorized data exposure?
> **Answer**: Spring Data JPA utilizes Hibernate parameterized prepared statements under the hood, completely preventing raw SQL injection. For data exposure, we use Data Transfer Objects (DTOs) like `UserSummaryDto` and `TaskResponse` to ensure sensitive fields such as password hashes are never serialized over REST responses.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
