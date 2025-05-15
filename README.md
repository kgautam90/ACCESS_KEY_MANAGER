<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Access Key Manager

A NestJS-based microservice application for managing access keys with rate limiting and JWT authentication.

## Features

- Access Key Management (Generate, Validate, Update, Delete)
- Rate Limiting per Access Key
- JWT Authentication
- Microservice Architecture
- Swagger API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
ACCESS_KEY_PORT=3001
TOKEN_PORT=3002
# Microservices
SERVICE_ACCESS_KEY_URL=http://localhost:3001
SERVICE_TOKEN_URL=http://localhost:3002 

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=access_key_manager 

# JWT Configuration will be used as JWT token for admin to do the operation
JWT_STATIC_TOKEN=ABCD1234
```

## Installation

```bash
# Install dependencies
$ npm install

# Create database
$ mysql -u root -e "CREATE DATABASE access_key_manager;"
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The application will start three services:
- Main API Service: http://localhost:3000
- Access Key Service: http://localhost:3001
- Token Service: http://localhost:3002

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/
```

## API Endpoints

### User Management

```bash
# Create a User
POST /users
Headers: 
  - Authorization: Bearer <jwt_static_token>
Body:
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "status": "active"  // optional, defaults to "active"
}

Response:
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "active",
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }
}
```

### Access Key Management

```bash
# Generate Access Key
POST /access-key/generate
Headers: 
  - Authorization: Bearer <jwt_static_token>
Body:
{
  "userId": "user_id_from_created_user",
  "rateLimit": 1000,  
  "expiry": "2024-04-21T10:00:00.000Z" 
}

# Validate Access Key
GET /access-key/validate/:key


# Update Access Key
PATCH /access-key/:key
Headers:
  - Authorization: Bearer <jwt_static_token>
Body:
{
  "rateLimit": number,
  "expiry": "date"
}

# Delete Access Key
DELETE /access-key/:key
Headers:
  - Authorization: Bearer <jwt_static_token>

# Get User Access Keys
GET /access-key/user/:userId
Headers:
  - Authorization: Bearer <jwt_static_token>
```

### Authentication

```bash
# Get JWT Token
GET /token/:key
```

## Rate Limiting

- Each access key has a configurable rate limit (requests per minute)
- Rate limits are tracked using an in-memory event stream
- Exceeding the rate limit returns a 429 Too Many Requests response

## Development

```bash
# Run tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Generate coverage report
$ npm run test:cov
```

## Project Structure

```
src/
├── access_key/           # Access Key Management
├── auth/                # Authentication
├── config/              # Configuration
├── logger/              # Logging Service
├── models/              # Database Models
├── token/              # Token Service
└── users/              # User Management
```

## Error Handling

The application uses a consistent error response format:

```json
{
  "status": number,
  "error": string,
  "message": string
}
```

## License

This project is [MIT licensed](LICENSE).
