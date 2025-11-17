# Employee API

A RESTful API for managing employee data, built with Express.js and Prisma, using PostgreSQL (Supabase).

## Base URL

- Local: `http://localhost:3000`
- Production: `https://api.afif.dev`

## Endpoints

### 1. Get All Employees

**GET** `/api/employees`

Retrieves a list of all employees.

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "salary": 50000,
    "age": 30
  },
  ...
]
```

**Example:**

```bash
curl https://api.afif.dev/api/employees
```

### 2. Get Employee by ID

**GET** `/api/employees/:id`

Retrieves a single employee by their ID.

**Parameters:**

- `id` (integer): Employee ID

**Response (Success):**

```json
{
  "id": 1,
  "name": "John Doe",
  "salary": 50000,
  "age": 30
}
```

**Response (Not Found):**

```json
{
  "message": "Employee not found"
}
```

**Example:**

```bash
curl https://api.afif.dev/api/employees/1
```

### 3. Create New Employee

**POST** `/api/employees`

Creates a new employee.

**Request Body:**

```json
{
  "name": "string",
  "salary": "integer",
  "age": "integer"
}
```

**Response (Success):**

```json
{
  "id": 2,
  "name": "Jane Smith",
  "salary": 60000,
  "age": 25
}
```

**Response (Validation Error):**

```json
{
  "message": "Name, salary, and age are required."
}
```

**Example:**

```bash
curl -X POST https://api.afif.dev/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "salary": 60000, "age": 25}'
```

### 4. Update Employee

**PATCH** `/api/employees/:id`

Updates an existing employee's details. Only provided fields are updated.

**Parameters:**

- `id` (integer): Employee ID

**Request Body (partial):**

```json
{
  "salary": 70000
}
```

**Response (Success):**

```json
{
  "id": 1,
  "name": "John Doe",
  "salary": 70000,
  "age": 30
}
```

**Response (Not Found):**

```json
{
  "message": "Employee not found"
}
```

**Example:**

```bash
curl -X PATCH https://api.afif.dev/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"salary": 70000}'
```

### 5. Delete Employee

**DELETE** `/api/employees/:id`

Deletes an employee by their ID.

**Parameters:**

- `id` (integer): Employee ID

**Response (Success):**

```json
{
  "message": "Employee deleted successfully."
}
```

**Response (Not Found):**

```json
{
  "message": "Employee not found"
}
```

**Example:**

```bash
curl -X DELETE https://api.afif.dev/api/employees/1
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## Data Model

### Employee

- `id`: Integer (auto-increment primary key)
- `name`: String
- `salary`: Integer
- `age`: Integer

## Setup (Local Development)

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run migrations: `npx prisma migrate dev`
5. Seed the database: `npm run seed`
6. Start the server: `npm run dev`

## Technologies Used

- Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- Node.js
