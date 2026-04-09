# RESTful API (TypeScript + Node.js + MongoDB)

This project provides a RESTful API for CRUD operations on users.

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
copy .env.example .env
```

3. Update `.env` values if required.

## Run in Development

```bash
npm run dev
```

## Build and Run

```bash
npm run build
npm start
```

## API Endpoints

Base URL: `http://localhost:5000`

- `GET /` - Health check
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Sample Request Body

For create and update:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 24
}
```
