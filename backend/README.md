# eCommerce API with AI Image Generation

A RESTful API for an eCommerce application built with Express.js, TypeScript, and MongoDB. This project provides comprehensive endpoints for managing users, categories, products, and orders, plus AI-powered product image generation using OpenAI's DALL-E 3.

**WBS Coding School - Module 3 Backend Project**

## 🚀 Features

- **User Management**: Create, read, update, and delete users
- **JWT Authentication**: Secure login/register system with token-based auth
- **Category Management**: Organize products into categories
- **Product Management**: Full CRUD operations for products with category relationships
- **Order Management**: Handle customer orders with product relationships
- **🎨 AI Image Generation**: Generate product images using OpenAI DALL-E 3
- **Input Validation**: Robust validation using Zod schemas
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **TypeScript**: Full type safety throughout the application
- **MongoDB Integration**: Using Mongoose ODM for database operations

## 🎯 Learning Objectives Covered

This project demonstrates:

- RESTful API design and implementation
- NoSQL database integration with MongoDB
- Authentication and authorization with JWT
- External API integration (OpenAI)
- TypeScript in a Node.js environment
- API documentation with Swagger
- Environment variable management
- Git version control and GitHub workflows

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** package manager
- **MongoDB** database (local installation)
- **OpenAI API Key** (for image generation features)

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vaeshkar/15_project02_ecommerce.git
   cd 15_project02_ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://admin:password@localhost:27017/ecommerce
   MONGODB_USERNAME=admin
   MONGODB_PASSWORD=your_password

   # Server
   PORT=3000
   NODE_ENV=development

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here

   # AI Image Generation
   OPENAI_API_KEY=sk-proj-your-openai-api-key-here
   ```

   **Note**: Never commit `.env.local` to version control!

4. **Start MongoDB**

   Make sure your MongoDB server is running locally.

## 🚀 Getting Started

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

The server will be available at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:3000/api-docs`

The API documentation includes interactive endpoint testing and authentication setup.

## 🛣️ API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (returns JWT token)

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Categories

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Products

- `GET /products` - Get all products (public)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (requires auth)
- `PUT /products/:id` - Update product (requires auth)
- `DELETE /products/:id` - Delete product (requires auth)

### Orders

- `GET /orders` - Get all orders (requires auth)
- `GET /orders/:id` - Get order by ID (requires auth)
- `POST /orders` - Create new order (requires auth)
- `PUT /orders/:id` - Update order (requires auth)
- `DELETE /orders/:id` - Delete order (requires auth)

### 🎨 AI Features

- `GET /ai/test` - Test AI service connectivity
- `POST /ai/generate-product-image` - Generate product image with DALL-E 3 (requires auth)

## 📊 Data Models

### User

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  password: string; // hashed with bcrypt
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product

```typescript
{
  name: string;
  description: string;
  price: number;
  categoryId: ObjectId;
  imageUrl?: string; // Can be AI-generated
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧠 AI Image Generation

The API integrates with OpenAI's DALL-E 3 to generate product images:

1. **Create a product** with name and description
2. **Call the AI endpoint** with the product ID
3. **Receive a generated image URL** based on the product details

Example auto-generated prompt:

```
"Professional product photography of Luxury Leather Handbag, Elegant brown leather handbag with gold hardware, white background, high quality, e-commerce style, studio lighting"
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to receive a JWT token
2. **Include the token** in the Authorization header: `Bearer your_jwt_token`
3. **Protected routes** will validate the token before processing requests

## 🔧 Project Structure

```
src/
├── App.ts                    # Main application entry point
├── controllers/              # Request handlers
├── db/                      # Database connection
├── models/                  # Mongoose models (User, Product, etc.)
├── routers/                 # Express routes
│   ├── authRouter.ts        # Authentication endpoints
│   ├── aiRouter.ts          # AI image generation
│   └── ...
├── middleware/              # Custom middleware
│   ├── auth.ts              # JWT verification
│   ├── validation.ts        # Request validation
│   └── errorHandler.ts      # Error handling
├── schemas/                 # Zod validation schemas
└── swagger.ts               # API documentation setup
```

## 🎓 Technologies Learned

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI
- **AI Integration**: OpenAI DALL-E 3 API
- **Development**: nodemon, ts-node
- **Version Control**: Git, GitHub

## 🔧 Development Challenges & Solutions

### Challenge 1: Environment Variable Loading

**Problem**: Environment variables not loading correctly causing MongoDB and API key issues.
**Solution**: Moved `dotenv.config()` before all imports to ensure variables load before modules that need them.

### Challenge 2: Git Security

**Problem**: Accidentally committed API keys to GitHub, triggering security warnings.
**Solution**: Used `git reset` to clean history and properly configured `.gitignore`.

### Challenge 3: API Integration

**Problem**: Hugging Face API was unreliable for image generation.
**Solution**: Switched to OpenAI DALL-E 3 for more reliable results.

## 🚀 Demo Instructions

For presentation/demo purposes:

1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: `http://localhost:3000/api-docs`
3. **Demo flow**:
   - Register a user via `/auth/register`
   - Copy the JWT token
   - Click "Authorize" in Swagger and enter the token
   - Create a product via `/products`
   - Generate an AI image via `/ai/generate-product-image`
   - Show the generated image URL

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- Environment variables for sensitive data
- Proper `.gitignore` configuration
- No API keys in source code

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running: `brew services start mongodb-community`
   - Check credentials in `.env.local`

2. **JWT Token Issues**

   - Ensure you're including `Bearer ` prefix in Authorization header
   - Check token hasn't expired (24h default)

3. **AI Image Generation Fails**

   - Verify OpenAI API key is valid
   - Check OpenAI account has sufficient credits
   - Test with `/ai/test` endpoint first

4. **Port Already in Use**
   - Kill process: `lsof -ti:3000 | xargs kill -9`
   - Or change PORT in `.env.local`

## 📝 Assignment Requirements Met

- ✅ RESTful API with CRUD operations
- ✅ Database integration with relationships
- ✅ Authentication system
- ✅ Input validation and error handling
- ✅ API documentation
- ✅ TypeScript implementation
- ✅ Git version control
- ✅ **Bonus**: AI integration for enhanced functionality

## 🎯 Future Enhancements

- Image upload and storage (AWS S3)
- Email verification system
- Password reset functionality
- Shopping cart management
- Payment integration
- Admin dashboard
- Product reviews and ratings

---

**WBS Coding School - Backend Development Module**
_Student: Dennis van Leeuwen_
_Project: eCommerce API with AI Integration_
