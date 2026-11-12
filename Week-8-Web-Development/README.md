# Week 8 - JobConnect Backend API

This folder extends the Week 7 **JobConnect React job/internship website** with a separate REST API. It does not overwrite or restructure the Week 7 frontend.

## Repository placement

Extract/copy this folder into the existing repository as:

```text
DG-Interns-Hub/
├── Week-7-Web-Development/       # Existing React + Vite frontend (leave unchanged)
└── Week-8-Web-Development/       # This Node/Express backend
```

## Stack
Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator, Helmet, CORS, rate limiting.

## Setup
Requirements: Node.js 18.18+ and MongoDB local or Atlas.

```bash
npm install
```

Copy `.env.example` to `.env`, then set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`.

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

API base: `http://localhost:5000/api/v1`

## Main capabilities
- Register/login/current-user/logout endpoints with JWT
- Candidate/recruiter/admin roles (admin must be assigned manually)
- User profile read/update/deactivate
- Job create/read/update/archive with ownership checks
- Job search, filters, sorting and pagination
- Candidate applications and recruiter status updates
- Centralized errors and request validation
- Password hashing, Helmet, CORS allowlist, rate limiting, request-size limit, Mongo query sanitization
- MongoDB indexes for common lookups and duplicate application prevention

## Week 7 relationship
The API's job schema follows the JobConnect listing concepts from Week 7: `title`, `company`, `location`, `type`, `workMode`, `description`, `skills`, `salary`, and `deadline`. Week 7 remains a working frontend using its existing sample data until you connect it to this API.

See `API-DOCUMENTATION.md` for endpoint details and integration notes. Import `postman/JobConnect-Week8.postman_collection.json` into Postman.

## Important limitations
- This is a local-development backend scaffold. It has not been run against your MongoDB credentials or tested in your environment.
- Logout is stateless: the frontend must remove its stored token. Production token revocation would need a token denylist or refresh-token design.
- No email delivery, file upload, refresh tokens, or Swagger UI are included.
- Demo job listings must not be represented as verified live vacancies.
- Never commit `.env` or real secrets.

## Suggested verification
1. `GET /api/health`
2. Register a candidate and log in.
3. Use recruiter account to create a job.
4. List/search/filter jobs without authentication.
5. Apply as candidate and inspect `/applications/my`.
6. Update application status as the owning recruiter.
7. Try unauthorized updates and confirm they return `403`.
