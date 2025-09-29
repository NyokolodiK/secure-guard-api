# SecureGuard API

This is the official backend API for the SecureGuard platform, built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Features

- **Authentication**: JWT-based authentication with refresh tokens.
- **Role-Based Access Control (RBAC)**: Differentiated access for clients, guards, and admins.
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) as the ORM.
- **API Documentation**: Interactive API documentation via Swagger (OpenAPI).
- **Production Hardening**: Includes security headers, rate limiting, compression, and structured logging.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for containerized deployment)
- A running PostgreSQL instance

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd secure-guard-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your local database connection string and any other required environment variables.

    ```env
    # .env
    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/secure_guard_db"
    JWT_SECRET="your-super-secret-jwt-key-here"
    # ... other variables
    ```

4.  **Run database migrations:**
    Apply the Prisma schema to your database.
    ```bash
    npx prisma migrate dev
    ```

### Running the Application

-   **Development mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```

-   **Production mode:**
    ```bash
    npm run start:prod
    ```

## API Endpoints

Once the application is running, the following key endpoints are available:

-   **API Base URL**: `http://localhost:3001/api/v1`
-   **Swagger Docs**: `http://localhost:3001/api-docs` (Available in development mode)
-   **Health Check**: `http://localhost:3001/api/v1/health`

## Running with Docker

To build and run the application using Docker:

1.  **Build the Docker image:**
    ```bash
    docker build -t secure-guard-api .
    ```

2.  **Run the Docker container:**
    Make sure to pass your `.env` file to the container.
    ```bash
    docker run --env-file .env -p 3001:3001 secure-guard-api
    ```

## Testing

-   **Run unit tests:**
    ```bash
    npm run test
    ```

-   **Run end-to-end (e2e) tests:**
    ```bash
    npm run test:e2e
    ```
