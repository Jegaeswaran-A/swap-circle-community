
# SwapSpace - Item Trading Platform

SwapSpace is an innovative platform designed to revolutionize the way people exchange goods without money, promoting sustainable living and community engagement.

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB installed locally or MongoDB Atlas account
- MongoDB Compass (for database visualization)

### Backend Setup
1. Install backend dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/swapspace
   JWT_SECRET=your-secure-jwt-secret-key-change-this
   PORT=3001
   ```
   
   > Note: Update the MongoDB URI if you're using MongoDB Atlas.

3. Start the backend server:
   ```
   node server.js
   ```
   
### Frontend Setup
1. Install frontend dependencies:
   ```
   npm install
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your MongoDB instance (default: `mongodb://localhost:27017`)
3. You should see the `swapspace` database with the following collections:
   - `users` - User accounts
   - `items` - Items available for swap

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item (auth required)
- `PUT /api/items/:id` - Update an item (auth required)
- `DELETE /api/items/:id` - Delete an item (auth required)

### User
- `GET /api/users/profile` - Get current user profile (auth required)
- `GET /api/users/items` - Get items owned by current user (auth required)

## Features

- User authentication (signup, login)
- Add items for swapping
- Browse all available items
- Filter and search items
- Manage your own items
- Edit or delete your listings
