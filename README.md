# MERN Senior Project

A full-stack application built with the MERN (MongoDB, Express.js, React, Node.js) stack, featuring a robust backend architecture with TypeScript.

## Project Structure

```
mern-senior/
├── backend/                  # Backend server
│   ├── src/                  # Source code
│   ├── coverage/            # Test coverage reports
│   ├── node_modules/        # Dependencies
│   ├── .env                 # Environment variables
│   ├── .env.development     # Development environment variables
│   ├── .env.test            # Test environment variables
│   ├── .env.production      # Production environment variables
│   ├── package.json         # Backend dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   ├── nodemon.json         # Nodemon configuration
│   ├── jest.config.js       # Jest test configuration
│   └── Postman-Collection.md # API documentation
```

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Swagger**: API documentation
- **Jest**: Testing framework
- **Zod**: Schema validation
- **Dotenv**: Environment variable management
- **Cors**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` file based on `.env.example` and configure your environment variables

### Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build:prod
npm run start:prod
```

### Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

## API Documentation

API documentation is available through Swagger UI when the server is running. The Postman collection is available in `Postman-Collection.md`.

## Environment Variables

The application uses different environment files for different environments:

- `.env.development`: Development environment
- `.env.test`: Test environment
- `.env.production`: Production environment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
