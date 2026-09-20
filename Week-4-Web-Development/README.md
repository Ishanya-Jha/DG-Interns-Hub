# 🔐 SecureAuth Dashboard

A secure full-stack authentication system and admin dashboard built as part of the **Week 5 Web Development Internship** at **DG Interns Hub**.

The project implements user authentication, JWT-based authorization, role-based access control, password hashing, protected routes, input validation, rate limiting, and MongoDB database integration.

---

## 🎯 Project Objective

The objective of this project is to build a secure full-stack web application with:

* User Signup
* User Login
* User Logout
* Password hashing using bcrypt
* JWT authentication
* Protected routes
* Role-based access control
* User profile dashboard
* Admin dashboard
* User search
* Admin user deletion
* MongoDB database integration
* Basic security mechanisms

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Security

* bcryptjs
* JSON Web Token (JWT)
* Helmet
* Express Rate Limit
* Input Validation
* Protected API Routes
* XSS-safe DOM Rendering

---

## 📁 Project Structure

```text
Week-5-Web-Development/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── style.css
│   └── script.js
│
├── images/
│   ├── signup.png
│   ├── login.png
│   ├── dashboard.png
│   ├── admin-dashboard.png
│   └── mongodb-users.png
│
└── README.md
```

> **Note:** The `.env` file is excluded from GitHub because it contains sensitive credentials and secrets.

---

## 🔑 Authentication System

### Signup

Users can create an account using:

* Name
* Email
* Password

The backend validates the submitted information before creating the account.

Passwords are hashed using **bcryptjs** before being stored in MongoDB.

### Login

Users log in using their registered email and password.

The backend:

1. Finds the user in MongoDB.
2. Compares the entered password with the stored bcrypt hash.
3. Generates a JWT token.
4. Returns the authenticated user's information.

The frontend stores the JWT token and uses it to access protected API endpoints.

### Logout

Logout removes the stored authentication information from the browser and redirects the user to the login page.

---

## 👥 Role-Based Access Control

The application supports two roles:

### 👤 User

Regular users can:

* Login
* View their own profile
* Access their dashboard
* Logout

### 🛠️ Admin

Administrators can:

* Login
* View their dashboard
* View all registered users
* Search users
* Delete users
* Access admin-only API endpoints

Admin authorization is handled using JWT role information and middleware.

---

## 📊 Dashboard

After successful login, users are redirected to the dashboard.

The dashboard displays:

* User name
* Email
* Role
* Account information
* Activity information

Administrators also have access to the Admin Dashboard.

---

## 🛡️ Security Features

### 1. Password Hashing

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

```javascript
const passwordHash = await bcrypt.hash(password, 10);
```

The original password is never stored in the database.

### 2. JWT Authentication

JSON Web Tokens are used to authenticate users.

```javascript
const token = jwt.sign(
    {
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);
```

Protected API requests require a valid JWT.

### 3. Protected Routes

Protected routes verify the JWT before allowing access.

Example:

```text
GET /api/users/profile
```

Without a valid token, the server returns an authentication error.

### 4. Role-Based Authorization

Admin routes require both authentication and the `admin` role.

```text
GET /api/users/admin/users
DELETE /api/users/admin/users/:id
```

Regular users cannot access these endpoints.

### 5. Input Validation

The backend validates:

* Required fields
* Name length
* Password length
* Existing email addresses

Invalid requests are rejected before database operations are performed.

### 6. XSS Protection

User-generated data is rendered using safe DOM methods such as `textContent` instead of directly injecting HTML.

This helps prevent malicious HTML or JavaScript from being interpreted as executable content.

### 7. Rate Limiting

Authentication routes use `express-rate-limit`.

The application limits repeated authentication attempts within a defined time window.

This helps reduce basic brute-force attempts.

### 8. Helmet

The Express application uses Helmet to add security-related HTTP headers.

```javascript
app.use(helmet());
```

---

## 🗄️ Database

The project uses **MongoDB Atlas** as the database.

### Database

```text
secureauth_db
```

### Collection

```text
users
```

Each user document contains:

```text
name
email
passwordHash
role
createdAt
updatedAt
```

Example:

```json
{
    "name": "Test User",
    "email": "testuser@example.com",
    "passwordHash": "bcrypt-hashed-password",
    "role": "user"
}
```

The original password is never stored.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/api/auth/signup` | Create a new account |
| POST   | `/api/auth/login`  | Login user           |

### User

| Method | Endpoint                     | Access              |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/users/profile`         | Authenticated users |
| GET    | `/api/users/admin/users`     | Admin only          |
| DELETE | `/api/users/admin/users/:id` | Admin only          |

---

## 📸 Screenshots

### 1. Signup Page

![SecureAuth Signup Page](images/signup.png)

### 2. Login Page

![SecureAuth Login Page](images/login.png)

### 3. User Dashboard

![SecureAuth User Dashboard](images/dashboard.png)

### 4. Admin Dashboard

![SecureAuth Admin Dashboard](images/admin-dashboard.png)

### 5. MongoDB Users Collection

![MongoDB Users Collection](images/mongodb-users.png)

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ishanya-Jha/DG-Interns-Hub.git
```

### 2. Navigate to the Project

```bash
cd DG-Interns-Hub/Week-5-Web-Development
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Create `.env`

Inside the `backend` folder, create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> **Warning:** Never upload the `.env` file to GitHub.

### 5. Start the Backend

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

### 6. Open the Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## 🧪 Testing

The following functionality was tested during development:

* User signup
* Duplicate email validation
* Password validation
* Password hashing
* User login
* JWT generation
* Protected profile route
* Invalid token handling
* Admin authorization
* Admin user listing
* User search
* Admin user deletion
* Logout
* MongoDB data storage
* Rate limiting
* Frontend dashboard navigation

---

## 🔄 Authentication Flow

```text
User
  │
  ▼
Signup
  │
  ▼
Input Validation
  │
  ▼
Password Hashing
  │
  ▼
MongoDB
  │
  ▼
Login
  │
  ▼
Password Verification
  │
  ▼
JWT Token
  │
  ▼
Protected Dashboard
  │
  ├── User → Own Profile
  │
  └── Admin → All Users + Delete Users
```

---

## 🎓 Learning Outcomes

Through this project, I gained practical experience with:

* Full-stack web application development
* REST API development
* Node.js and Express.js
* MongoDB and Mongoose
* JWT authentication
* Password hashing
* Middleware
* Role-based authorization
* API security
* Input validation
* Rate limiting
* Frontend and backend integration
* Git and GitHub
* Debugging authentication systems

---

## 👨‍💻 Internship Information

| Detail       | Information                     |
| ------------ | ------------------------------- |
| Internship   | Web Development Internship      |
| Organization | DG Interns Hub                  |
| Batch        | 1 August                        |
| Task         | Week 5 Advanced Web Application |
| Project      | SecureAuth Dashboard            |

---

## 🔒 Security Notice

Sensitive information such as:

* MongoDB connection strings
* Database passwords
* JWT secrets
* User passwords
* API credentials

must never be committed to the repository.

The `.env` file is excluded using `.gitignore`.

---

## 📌 Project Status

**Status: ✅ Completed**

The SecureAuth Dashboard successfully implements:

* Authentication
* Authorization
* JWT security
* Password hashing
* Protected routes
* Role-based access control
* MongoDB integration
* User dashboard
* Admin dashboard
* User search
* Admin user deletion
* Basic security features
