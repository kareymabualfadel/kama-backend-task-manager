📦 Kama Task Manager — Full-Stack Backend + Security Project

A full-stack Node.js application that progressively evolved from a simple CRUD web app into a secure multi-user and role-based backend architecture with penetration testing and admin-level management capabilities.

This project demonstrates how to design, extend, and secure a modern backend application while applying real-world software engineering and security concepts.

🎯 Key Features

✔ RESTful task management API
✔ MongoDB persistence with Mongoose
✔ JWT authentication (login + register)
✔ Authorization w/ role-based access control
✔ Admin dashboard with user & task management
✔ Validation middleware & centralized error handling
✔ Clean MVC architecture (routes/controllers/models)
✔ Frontend integration via Fetch API
✔ Penetration testing focused on security exposures
✔ Docker deployment (optional)

🧩 Skills & Concepts Demonstrated

This project teaches and demonstrates how to design, secure, and extend a backend application:

✔ Authentication + Authorization
✔ Data modeling + persistence
✔ REST API best practices
✔ RBAC (Role-Based Access Control)
✔ Admin-only operations
✔ State + trust boundaries
✔ Security testing
✔ Clean code separation (MVC)
✔ Deployment readiness
✔ Dockerization (optional)

🧱 High-Level Architecture
flowchart TB
    FRONTEND[Frontend\nHTML/JS/CSS]
    BACKEND[Node.js + Express\nMVC + JWT]
    DB[(MongoDB)]

    FRONTEND -->|HTTP/REST + JWT| BACKEND --> DB
    BACKEND --> DB

🧰 Technology Stack
Layer	Tech
Frontend	HTML, CSS, Vanilla JS
Backend	Node.js + Express
Auth	JWT (Bearer tokens)
DB	MongoDB (Mongoose ODM)
Roles	user + admin
Architecture	MVC
Deployment	Docker (optional)
👥 User Roles & Permissions
Standard User

✔ Create tasks
✔ Edit tasks
✔ Delete tasks
✔ View only their own tasks

Admin User

Admin can additionally:

✔ Create / edit / delete users
✔ View all users
✔ View all tasks
✔ Manage any user’s tasks
✔ Assign roles

🔐 Security Features

🛡 JWT authentication (Bearer scheme)
🛡 Password hashing (bcrypt)
🛡 Protected routes middleware
🛡 RBAC-based access control
🛡 Input validation + sanitization
🛡 Centralized error handling
🛡 No sensitive data stored client-side

🧪 Penetration Testing Performed

The application was manually tested for realistic web attack scenarios including:

✔ Authentication & session abuse
✔ Privilege escalation attempts
✔ Forced browsing
✔ Broken access control across users/admin
✔ Task ownership bypass attempts
✔ Redirect / token replay attempts
✔ JSON tampering
✔ CORS misconfiguration checks
✔ Input validation failures
✔ Stored (persistent) XSS attempts
✔ Blind/Reflected XSS attempts
✔ CSRF feasibility
✔ Local network exposure testing (0.0.0.0 vs localhost)

No automated scanners — all tests were performed manually to simulate attacker intent.

🏗 Backend Architecture (MVC)
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 └── server.js

Controllers

Handle business logic

Routes

Define REST endpoints

Models

Define MongoDB schemas

Middleware

Auth, validation, error handling

🖥 Admin Dashboard

Admin dashboard provides:

✔ User CRUD
✔ Task CRUD (own + others)
✔ User filtering
✔ Modal-based editing
✔ Role assignment

❗ Trust Boundaries

This project intentionally models trust boundaries:

Boundary	Concern
Client → API	Authentication + input validation
API → DB	Data integrity + injection
User → Admin	Authorization
Admin → System	Privilege separation

Understanding these is critical for real-world DevSecOps and PT work.

🛠 API Endpoints Overview
Auth
POST /api/auth/register
POST /api/auth/login

Tasks (User)
GET /api/tasks/
POST /api/tasks/
PUT /api/tasks/:id
DELETE /api/tasks/:id

Admin
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

GET /api/admin/tasks
POST /api/admin/tasks
PUT /api/admin/tasks/:id
DELETE /api/admin/tasks/:id

🗄 Database Models
User
{
  username,
  passwordHash,
  role
}

Task
{
  user,
  title,
  description,
  status
}

🐳 Docker Deployment (Optional)

Project includes a Dockerfile for containerized deployment:

✔ portable
✔ reproducible
✔ production-friendly

🚀 Future Enhancements

Planned improvements:

⬜ Refresh tokens + logout
⬜ 2FA for admin
⬜ Audit logs / event tracking
⬜ Email reset flows
⬜ Role editor UI
⬜ Kubernetes deployment (ties to CI/CD project)

🎓 Why This Project Matters

This isn’t a “tutorial clone”.

This app was:

✔ designed
✔ extended
✔ secured
✔ tested

with a real engineering mindset relevant to:

⭐ Software development
⭐ Backend engineering
⭐ Penetration testing
⭐ DevSecOps
⭐ Cloud deployment

🧠 Final Note

“Security is understanding how software actually behaves.”

This project represents that philosophy: build, break, secure, improve.
