# Medium Backend

Welcome to the backend API for a robust blogging website, built with a focus on performance, maintainability, and ease of use. Explore, interact with, and contribute to this project!

## Features

- **RESTful API:** Provides a clean and well-defined interface for creating, managing, and interacting with blog posts.
- **Hono Routing:** Leverages the efficient Hono routing library for high-performance request handling.
- **Cloudflare Workers Deployment:** Enjoys the global reach and scalability of Cloudflare Workers for reliable deployments.
- **TypeScript:** Ensures strong type safety and code maintainability.
- **Zod Validation:** Implements robust data validation for API requests, preventing invalid entries.
- **@hono/zod-openapi:** Facilitates automatic client-side code generation based on OpenAPI specifications.
- **Prisma ORM:** Seamlessly interacts with a PostgreSQL database for persistent data storage.
- **Prisma Accelerate:** Optimizes database queries for improved performance.
- **PostgreSQL Database:** Provides a robust and scalable data storage solution.
- **Cookies:** Maintains a secure authorization mechanism for user authentication.
- **@hono/swagger-ui:** Offers a user-friendly Swagger UI to explore and test API endpoints.

## Tech Stack

- **Frontend:** Not included in this repository (consider creating a separate repository for the frontend)
- **Backend:**
  - Hono Routing
  - Cloudflare Workers
  - TypeScript
  - Zod
  - @hono/zod-openapi
  - Prisma ORM
  - Prisma Accelerate
  - PostgreSQL
  - Cookies
  - @hono/swagger-ui

## Getting Started

1. **Prerequisites:**
    * Node.js and npm (or yarn) installed on your system
    * A Cloudflare account with Worker functionality enabled
2. **Clone the Repository:**
   ```bash
   git clone [https://github.com/askushw07/medium-backend.git](https://github.com/askushw07/medium-backend.git)```

3. **Install Dependencies:**
   ```bash
  cd medium-backend
  npm install```

4. **Configure Environment Variables:**
Create a .env file in the project root directory.
Add required environment variables, such as:
```DATABASE_URL=your_postgres_database_url```

add these line in wrangler.toml file
```
DATABASE_URL=your_prisma accelerate url
jwt_secerete
```

you can use above secrete in c.process.secreteName

Replace your_postgres_database_url with your actual PostgreSQL connection string.
Replace your_secret_key_for_cookies with a strong secret key for secure cookie signing.

5. **Deploy to Cloudflare Workers:**
Follow Cloudflare's documentation on deploying Workers applications (https://developers.cloudflare.com/workers/api/).
Ensure your Worker script points to the entry point (e.g., index.ts).

**API Documentation and Interaction:**
The API follows a RESTful architectural style.
explore the backend code on github: [https://github.com/askushw07/medium-backend.git](https://github.com/askushw07/medium-backend.git)
explore the backend on cloudflare worker: [backend_url](https://backend.hawdaex.workers.dev/)
Refer to the autogenerated OpenAPI documentation: [OpenApi autogenerated clients](https://backend.hawdaex.workers.dev/doc)
Explore and test API endpoints using the Swagger UI: [OpenApi autogenerated api endpoints](https://backend.hawdaex.workers.dev/ui)


**Contributing**
We welcome contributions to this project! Please create pull requests if you have improvements or additional features.

**License**
This project is licensed under the MIT License (see LICENSE.md for details).

ℹ️ Additional Notes
Consider adding instructions for local development if applicable to your project setup.
You might want to include specific instructions for setting up database credentials (e.g., using command-line flags or environment variables).
Explore adding examples or code snippets for API usage in different languages.
   
