# Educational Platform - Backend API

Backend service for the Educational Platform built with Node.js, Express, and MongoDB (Mongoose). Follows an MVC architecture.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables in `.env` (a working default is provided):
   - `MONGO_URI` - your MongoDB connection string
   - `JWT_SECRET` - replace with a long random string before deploying
   - `JWT_EXPIRES_IN` - token lifetime (default `7d`)
   - `CLIENT_URL` - your React frontend URL, for CORS

3. Run the server:
   ```
   npm run dev    # development with nodemon
   npm start      # production
   ```

The API runs on `http://localhost:5000` by default.

## Folder Structure

```
backend/
├── config/         # DB connection and app constants
├── controllers/     # Business logic
├── middleware/      # Auth, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── utils/           # Shared helpers (AppError)
└── server.js        # App entry point
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint            | Access | Description                  |
|--------|---------------------|--------|-------------------------------|
| POST   | /register           | Public | Register (student/instructor) |
| POST   | /login              | Public | Login, returns JWT             |
| GET    | /me                 | Private| Get current user profile       |
| PATCH  | /me                 | Private| Update name/bio/avatar          |
| PATCH  | /update-password    | Private| Change password                |

### Courses (`/api/courses`)
| Method | Endpoint              | Access              | Description                  |
|--------|-----------------------|---------------------|-------------------------------|
| GET    | /                     | Public              | List published courses         |
| GET    | /my-courses           | Private             | Instructor's or student's courses |
| GET    | /:id                  | Public              | Get a single course             |
| POST   | /                     | Instructor/Admin    | Create a course                  |
| PATCH  | /:id                  | Owner/Admin         | Update a course                  |
| DELETE | /:id                  | Owner/Admin         | Delete a course                  |
| POST   | /:id/lessons          | Owner/Admin         | Add a lesson                     |
| POST   | /:id/enroll           | Student             | Enroll in a course               |

### Quizzes (`/api/quizzes`)
| Method | Endpoint               | Access              | Description                          |
|--------|------------------------|---------------------|----------------------------------------|
| POST   | /                       | Instructor/Admin    | Create a quiz                           |
| GET    | /course/:courseId       | Private             | List quizzes for a course               |
| GET    | /:id                    | Private             | Get quiz (answers hidden from students) |
| PATCH  | /:id                    | Owner/Admin         | Update a quiz                            |
| DELETE | /:id                    | Owner/Admin         | Delete a quiz                            |
| POST   | /:id/submit             | Student             | Submit answers, get instant result       |
| GET    | /:id/my-submission      | Student             | View own result                          |
| GET    | /:id/submissions        | Owner/Admin         | View all student submissions             |

### Admin (`/api/admin`)
| Method | Endpoint                  | Access | Description              |
|--------|---------------------------|--------|---------------------------|
| GET    | /stats                    | Admin  | Platform dashboard stats   |
| GET    | /users                    | Admin  | List all users             |
| GET    | /users/:id                | Admin  | Get a single user           |
| PATCH  | /users/:id/role           | Admin  | Change a user's role        |
| PATCH  | /users/:id/toggle-status  | Admin  | Activate/deactivate user    |
| DELETE | /users/:id                | Admin  | Delete a user                |

## Authentication

All protected routes require a header:
```
Authorization: Bearer <token>
```
The token is returned on register/login.

## Response Format

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Errors follow:
```json
{
  "success": false,
  "message": "..."
}
```
