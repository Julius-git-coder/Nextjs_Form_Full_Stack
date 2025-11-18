Next.js Full-Stack Form Validation

A full-stack web application built with Next.js 13+ (App Router) that implements robust form validation for authentication workflows, including Signup, Login, Forget Password, and a protected Dashboard.

Features

Signup: Register new users with client-side and server-side validation.

Login: Authenticate users securely.

Forget Password: Reset passwords via a secure token or email link.

Dashboard: Protected route, accessible only by authenticated users.

Form Validation:

Client-side validation using React hooks.

Server-side validation via Next.js API routes.

Full-Stack Integration: Connects to MongoDB (or your preferred DB) for user data storage.

Secure Authentication: Password hashing and session management.

Tech Stack

Frontend: Next.js (App Router), React, Tailwind CSS (optional)

Backend: Next.js API Routes

Database: MongoDB / Mongoose

Authentication: JWT or NextAuth.js

Validation: Yup / Zod / Custom validation logic

Project Structure
/app
├── auth/
│    ├── login/
│    │    └── page.jsx             # Route: /auth/login
│    ├── signup/
│    │    └── page.jsx             # Route: /auth/signup
│    └── forget-password/
│         └── page.jsx             # Route: /auth/forget-password
├── dashboard/
│    └── page.jsx                   # Route: /dashboard
├── components/                      # Reusable UI components (Input, Button, Navbar)
├── lib/                             # Database connections and helper functions
├── styles/                          # Global and component-specific styles
└── utils/                           # Validation schemas, authentication helpers
/pages/api/
├── auth/
│    ├── login.js
│    ├── signup.js
│    └── forget-password.js          # API endpoints for authentication

Installation

Clone the repository:

git clone https://github.com/yourusername/nextjs-form-validation.git


Navigate to the project folder:

cd nextjs-form-validation


Install dependencies:

yarn install
# or
npm install


Configure environment variables in .env.local:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000


Run the development server:

yarn dev
# or
npm run dev


Open http://localhost:3000
 to see the app in action.

Usage

Visit /auth/signup to create a new account.

Visit /auth/login to log in.

Visit /auth/forget-password to reset your password.

After logging in, access /dashboard for protected content.

Future Improvements

Add email verification for new users.

OAuth login (Google, GitHub, etc.).

Real-time notifications in the dashboard.

Enhanced UI with animations and responsiveness.

License

This project is licensed under the MIT License.