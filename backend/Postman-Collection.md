# ToDo API Collection

This document provides the Postman collection for the ToDo API endpoints. The base URL for all endpoints is `http://localhost:5000/api/todos`.

## Collection Variables

- `base_url`: `http://localhost:5000/api/todos`

## Endpoints

### 1. Create Todo

**POST** `/todos`

Creates a new todo item.

#### Request Body

```json
{
  "title": "Complete project",
  "description": "Finish the MERN stack project"
}
```

#### Response (201 Created)

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Complete project",
  "description": "Finish the MERN stack project",
  "completed": false,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### 2. Get All Todos

**GET** `/todos`

Retrieves all todo items.

#### Response (200 OK)

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Complete project",
    "description": "Finish the MERN stack project",
    "completed": false,
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z"
  }
]
```

### 3. Get Single Todo

**GET** `/todos/:id`

Retrieves a specific todo item by ID.

#### URL Parameters

- `id`: Todo item ID

#### Response (200 OK)

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Complete project",
  "description": "Finish the MERN stack project",
  "completed": false,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

#### Error Response (404 Not Found)

```json
{
  "status": 404,
  "message": "Todo not found"
}
```

### 4. Update Todo

**PUT** `/todos/:id`

Updates a specific todo item.

#### URL Parameters

- `id`: Todo item ID

#### Request Body

```json
{
  "title": "Updated project",
  "description": "Updated description",
  "completed": true
}
```

#### Response (200 OK)

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Updated project",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:30:00.000Z"
}
```

#### Error Response (404 Not Found)

```json
{
  "status": 404,
  "message": "Todo not found"
}
```

### 5. Delete Todo

**DELETE** `/todos/:id`

Deletes a specific todo item.

#### URL Parameters

- `id`: Todo item ID

#### Response (200 OK)

```json
{
  "message": "Todo deleted successfully"
}
```

#### Error Response (404 Not Found)

```json
{
  "status": 404,
  "message": "Todo not found"
}
```

## Error Handling

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "status": 400,
  "message": "Validation error message"
}
```

### 500 Internal Server Error

```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```

## Postman Collection Import

To import this collection into Postman, create a new collection and add the following requests:

1. Create Todo (POST)
2. Get All Todos (GET)
3. Get Single Todo (GET)
4. Update Todo (PUT)
5. Delete Todo (DELETE)

Set the collection variable `base_url` to `http://localhost:5000/api/todos` and use it in all request URLs as `{{base_url}}`.
