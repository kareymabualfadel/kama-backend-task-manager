
# 🗂️ Kama Tasks — Full-Stack Task Manager (User + Admin Management)

A full-stack task management system with:

✔ 🧑 User accounts (signup/login)  
✔ 🛂 Role-based access (User + Admin)  
✔ 📝 Per-user task CRUD  
✔ 🧑‍💼 Admin dashboard with user & task management  
✔ 🔐 JWT authentication + password hashing  
✔ 🛡️ Manual penetration testing + security validation  
✔ 🧱 Clean MVC backend architecture  
✔ 🌐 Frontend REST integration  
✔ 🧰 MongoDB persistence with ownership binding  

This project was built to simulate **real-world multi-user systems**, practice **secure API design**, and prepare for **DevSecOps CI/CD integration**.

---

## 🎯 **Project Purpose**

This project teaches and demonstrates **how to design**, **secure**, and **extend** a modern backend application:

✔ Authentication + Authorization  
✔ Data modeling + persistence  
✔ REST API best practices  
✔ Role-based access control  
✔ Admin-only operations  
✔ State + trust boundaries  
✔ Security testing  
✔ Clean code separation (MVC)  
✔ Deployment readiness (Docker)  

---

## 🧱 **High-Level Architecture**

```mermaid
flowchart TB
    FRONTEND[Frontend\nHTML/JS/CSS]
    BACKEND[Node.js + Express\nMVC + JWT]
    DB[(MongoDB)]

    FRONTEND -->|HTTP/REST + JWT| BACKEND --> DB

🗄️ Technology Stack

Frontend

HTML + CSS + Vanilla JavaScript

LocalStorage token handling

REST API calls

Role-based redirection

Backend

Node.js (Express)

JWT Authentication

BCrypt password hashing

MVC architecture (controllers, routes, middleware)

Admin & user roles

RBAC enforcement

Database

MongoDB + Mongoose

ObjectID binding (task.user → User._id)

Schemas + timestamps

👥 User Roles
Role	Permissions
User	CRUD only own tasks
Admin	CRUD users + CRUD all tasks + CRUD own tasks
🧩 Key Features
🔐 Authentication & Authorization

JWT issued on login/signup

Protected API routes with middleware

Password hashing via BCrypt

LocalStorage token persistence

Role-based redirection:

user → index.html

admin → admin.html

🗂️ Task Management

Create / Edit / Delete tasks

Status updates (open / done)

Task ownership enforced in backend

Admin can operate on all tasks

👤 User Management (Admin Dashboard)

Admin can:
✔ Create users
✔ Assign roles
✔ Edit users
✔ Delete users
✔ View tasks by user
✔ Create tasks for other users

🧱 Backend Folder Structure (MVC)
backend/
  controllers/
  middleware/
  models/
  routes/
  config/
  server.js
  app.js
frontend/
  index.html
  admin.html
  login.html
  js/


This separation prepares the system for:

✔ scaling
✔ testing
✔ CI/CD
✔ containerization
✔ microservices

🔴 Security & Penetration Testing (Manual Offensive Validation)

Before CI/CD or deployment, the system underwent targeted manual penetration testing focusing on auth, RBAC, trust, and ownership.

🧪 Tested Attack Surfaces
1. Authentication

Attacks tried:

Null credential bypass

Token reuse/replay

JWT tampering

Signature manipulation

Mitigation:
✔ JWT signature enforcement
✔ Hash comparison via BCrypt

2. Authorization & RBAC

Tested for:

Vertical escalation: user → admin

Horizontal escalation: userA → userB tasks

Forced browsing: /api/admin/...

Mitigation:
✔ authRequired + requireAdmin middleware
✔ ownership checks on task queries

3. Stored Content Injection

Payloads:

<script>alert(1)</script>
<img src=x onerror=alert(1)>


Outcome:
Stored XSS possible in raw browser UI → planned mitigation via escaping.

4. Network Exposure

Checked:

Binding (localhost vs 0.0.0.0)

LAN reachability

NAT barriers

Port scanning via Nmap

Outcome:
App limited to LAN, router blocks WAN unless port-forwarded.

5. Direct API Abuse

Using curl/Postman to bypass UI:

curl -X POST /api/tasks


Outcome:
✔ returns 401 without token

📦 Security Improvements Implemented

✔ JWT auth
✔ BCrypt password hashing
✔ Role-based access control
✔ CORS policies
✔ Helmet secure headers
✔ Input validation
✔ Enum validation
✔ Centralized error handling

🧬 How This Supports DevSecOps

This backend is now ready for:

✔ Docker
✔ Jenkins / GitHub Actions CI/CD
✔ Image scanning (Trivy)
✔ IaC (Terraform)
✔ Kubernetes
✔ Monitoring (ELK/Prometheus)

Security here is Phase 0:

Build → Attack → Fix → Automate → Enforce

🐳 Dockerization (Future)

Container planned:

FROM node:18
WORKDIR /app
COPY . .
npm install
CMD ["node", "server.js"]

📦 API Overview
Auth Routes
POST /api/auth/register
POST /api/auth/login

User Routes (Admin)
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

Task Routes (User)
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Task Routes (Admin)
GET /api/admin/tasks
GET /api/admin/tasks?user=123
POST /api/admin/tasks
PUT /api/admin/tasks/:id
DELETE /api/admin/tasks/:id

🚀 Next Planned Steps

OAuth2 / SSO login

MFA / TOTP

Audit logs

Web UI improvements

WebSockets for real-time status

CI/CD integration

Kubernetes deployment

Secret scanning & image scanning

🧠 Final Notes

This project is not just a CRUD app — it is a security-aware, multi-user backend built to mimic real production concerns:

authentication → authorization → ownership → persistence → exposure → security → DevOps


---

# If you want, I can also generate:

✅ CV bullet for this project  
✅ Portfolio website section  
✅ LinkedIn announcement post  
✅ Interview explanation  
✅ Demo video script  

Just tell me which format.
