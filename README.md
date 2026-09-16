# Task Management Platform 📋

A full-stack Task Management Platform that allows users to create, manage, assign, and track tasks through a simple and secure web application.

## 🎯 Why This Project?

Managing tasks becomes difficult when there are multiple tasks, priorities, deadlines, and team members.

This project was built to provide a simple platform where users can:

* Create and manage tasks
* Set priorities and due dates
* Track task progress
* Assign tasks to other users
* View tasks through a dashboard
* Secure user accounts and task data

The project also helped in understanding how a **React frontend communicates with a Spring Boot REST API and PostgreSQL database**.

## 💡 How It Helps

The platform can be useful for:

* 👨‍🎓 Students managing assignments and projects
* 👨‍💻 Developers managing development tasks
* 👥 Small teams assigning responsibilities
* 📅 Tracking deadlines and task progress

It provides a centralized place to organize tasks instead of managing them through notes or messages.

## ✨ Main Features

* User Registration and Login
* JWT-based Authentication
* Create, Read, Update and Delete Tasks
* Task Assignment
* Task Priorities — Low, Medium, High
* Task Status — To Do, In Progress, Completed
* Due Date Tracking
* Dashboard with task statistics
* Task filtering
* Role-based access for users and administrators
* Responsive interface

## 🛠️ Tech Stack

### Frontend

**React**

Used to build the user interface using reusable components and manage application state.

**Vite**

Used as the frontend build tool because it provides fast development and quick updates while building the application.

**React Router**

Used for navigation between pages such as Login, Signup, Dashboard, Create Task, and Edit Task.

**CSS**

Used for styling the application with a lightweight responsive design without depending on a large UI framework.

### Backend

**Java 17**

Used as the main programming language because of its modern features and long-term support.

**Spring Boot**

Used to build the backend REST APIs and handle the application's business logic.

**Spring Security + JWT**

Used to secure the application and authenticate users without relying on traditional server-side sessions.

**Spring Data JPA + Hibernate**

Used to communicate with the database using Java objects instead of writing database queries for every operation.

**Maven**

Used to manage backend dependencies and build the Spring Boot application.

### Database

**PostgreSQL**

Used to store users and tasks because it is a reliable relational database and works well with structured application data.

## 🔐 Security

The application uses:

* JWT authentication
* BCrypt password hashing
* Protected API endpoints
* Role-based access control
* CORS configuration

User passwords are stored as hashed values rather than plain text.

## 🏗️ Project Flow

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
Spring Security + JWT
      ↓
Service Layer
      ↓
Spring Data JPA
      ↓
PostgreSQL
```

The React frontend sends requests to the Spring Boot backend.
The backend processes the request, performs the required operations, and stores or retrieves data from PostgreSQL.

## 📂 Project Structure

```text
TASK-MANAGEMENT-PLATFORM
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── dto
│   ├── security
│   └── config
│
├── frontend
│   └── src
│       ├── components
│       ├── pages
│       └── services
│
└── README.md
```

## 🚀 How to Run

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### Database

Create a PostgreSQL database and configure the database username, password, and connection details in:

```text
backend/src/main/resources/application.properties
```

## 📌 What I Learned

Through this project, I practiced:

* Building REST APIs with Spring Boot
* Connecting React with a backend API
* CRUD operations
* JWT authentication
* Spring Security
* Database operations using JPA/Hibernate
* React components and routing
* Connecting a full-stack application with PostgreSQL
* Structuring a full-stack project

---

### 👨‍💻 Project

**Task Management Platform**

**Frontend:** React + Vite
**Backend:** Java + Spring Boot
**Database:** PostgreSQL
**Authentication:** Spring Security + JWT
