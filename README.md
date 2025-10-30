# Admin Backend API

A secure, scalable Node.js backend API for admin authentication and user management with TypeScript, MongoDB, and comprehensive documentation.

## 🚀 Features

- **JWT Authentication** - Secure admin login/logout
- **User Management** - CRUD operations for user management
- **Device Verification** - User device verification system
- **Dashboard Analytics** - Statistical data and insights
- **Rate Limiting** - Protection against brute force attacks
- **Security Headers** - Enhanced security with Helmet.js
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Audit Logging** - Comprehensive action tracking
- **Docker Support** - Containerized deployment

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure
src/
├── controllers/ # Route controllers
├── middlewares/ # Custom middleware functions
├── routes/ # API route definitions
├── services/ # Business logic layer
├── models/ # Database models
└── server.ts # Application entry point


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone [<your-repo-url>](https://github.com/SibomanaEdouard/jambo-admin-backend.git)
   cd admin-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit \`.env\` with your configuration:
   \`\`\`env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/admin-db
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   \`\`\`

4. **Start the application**
   \`\`\`bash
   # Development
   npm run dev

   # Production
   npm start

   # Build
   npm run build
   \`\`\`

## 📚 API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:5001/api-docs
- **Health Check**: http://localhost:5001/api/health
- **API Base URL**: http://localhost:5001/api

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/admin/auth/login\` | Admin authentication |
| POST | \`/api/admin/auth/logout\` | Admin logout |

### User Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/admin/users\` | Get paginated users list |
| GET | \`/api/admin/users/dashboard/stats\` | Get dashboard statistics |
| POST | \`/api/admin/users/{userId}/verify-device\` | Verify user device |

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Docker Only

\`\`\`bash
# Build image
docker build -t admin-backend .

# Run container
docker run -p 5001:5001 --env-file .env admin-backend
\`\`\`

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`PORT\` | Server port | \`5001\` |
| \`MONGODB_URI\` | MongoDB connection string | - |
| \`JWT_SECRET\` | JWT signing key | - |
| \`CLIENT_URL\` | Frontend URL for CORS | \`http://localhost:5173\` |
| \`NODE_ENV\` | Environment mode | \`development\` |

## 🔧 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server with hot-reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm test            # Run test suite
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
\`\`\`

## 🛡 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Security headers with Helmet.js
- Input validation with express-validator
- MongoDB injection protection

## 📊 Health Check

The application provides a health check endpoint:

\`\`\`bash
curl http://localhost:5001/api/health
\`\`\`

Response:
\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Admin Backend",
  "version": "1.0.0"
}
\`\`\`

## 🗄 Database


## 🚢 Deployment

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email [sibomanaedouard974@gmail.com] or create an issue in the repository.

---

**Built  using TypeScript, Express, and MongoDB**

For  admin  backend  to function  well ,  you have to make  sure that   client  backend is also  running   and make sure  they are communicating