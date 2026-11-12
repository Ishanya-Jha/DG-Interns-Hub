# JobConnect REST API (Week 8)

Base URL: `http://localhost:5000/api/v1`

All responses use `{ "success": boolean, "message": string, "data": object|null }`.
List endpoints may also return `meta` with pagination information.

## Authentication
Send `Authorization: Bearer <token>` for protected routes.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register candidate/recruiter |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Authenticated | Current user |
| POST | `/auth/logout` | Authenticated | Stateless logout acknowledgement |

Registration JSON:
```json
{ "name":"Asha Sharma", "email":"asha@example.com", "password":"Password123", "role":"candidate" }
```
Public registration does not allow admin accounts. Promote an admin manually in the database for local testing.

## Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users/profile` | Authenticated |
| PUT | `/users/profile` | Authenticated |
| DELETE | `/users/profile` | Authenticated (deactivates account) |

Editable fields: `name`, `phone`, `location`, `bio`.

## Jobs
| Method | Endpoint | Access |
|---|---|---|
| GET | `/jobs` | Public |
| GET | `/jobs/:id` | Public |
| POST | `/jobs` | Recruiter/Admin |
| PUT | `/jobs/:id` | Owner Recruiter/Admin |
| DELETE | `/jobs/:id` | Owner Recruiter/Admin (archives) |

Query parameters: `search`, `type`, `workMode`, `location`, `skill`, `page`, `limit`, `sort`.
Sort values: `newest`, `oldest`, `deadline`. Maximum page size: 50.

Job JSON:
```json
{
  "title":"Frontend Developer Intern",
  "company":"Example Labs",
  "location":"Remote",
  "type":"Internship",
  "workMode":"Remote",
  "description":"Build and maintain React user interfaces.",
  "skills":["React","JavaScript","CSS"],
  "salary":"₹10,000/month",
  "deadline":"2026-12-31"
}
```
The job fields intentionally map to the Week 7 JobConnect card concepts: title, company, location, type, workMode, description and skills.

## Applications
| Method | Endpoint | Access |
|---|---|---|
| POST | `/applications` | Candidate |
| GET | `/applications/my` | Candidate |
| GET | `/applications/:id` | Applicant, owning recruiter, Admin |
| PUT | `/applications/:id/status` | Owning Recruiter/Admin |
| DELETE | `/applications/:id` | Applicant/Admin |

Apply JSON: `{ "jobId":"<mongo-job-id>", "coverLetter":"..." }`
Status JSON: `{ "status":"Shortlisted" }`

## Error codes
- `400`: invalid input or ID
- `401`: missing, invalid or expired JWT
- `403`: authenticated but not permitted
- `404`: route/resource not found
- `409`: duplicate email/application
- `500`: unexpected server error

## Frontend integration (Week 7 React/Vite)
1. Keep the Week 7 project in its existing folder. This Week 8 backend is a sibling folder, not a replacement.
2. In `Week-7-Web-Development/.env`, set `VITE_API_BASE_URL=http://localhost:5000/api/v1`.
3. In React, call `fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`)`.
4. Read jobs from `response.data.jobs` and pagination from `response.meta`.
5. Convert the backend `type` and `workMode` values to the exact labels used by the UI if the existing UI uses different casing.
6. The Week 7 project currently uses sample frontend data. It will continue to work unchanged until you deliberately replace that data source with API calls.

CORS is configured for `http://localhost:5173` by default. Update `CLIENT_ORIGIN` if Vite runs on another origin.
