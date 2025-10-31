# Frontend - Task Manager

Modern React application built with Vite and TailwindCSS.

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- 🎨 Modern UI with TailwindCSS
- 🔐 JWT Authentication
- 📱 Responsive Design
- 🎯 Task Management (CRUD)
- 📊 Dashboard with Statistics
- 👥 User Management (Admin)
- 🔔 Toast Notifications
- 🛡️ Protected Routes

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── TaskCard.jsx
│   ├── TaskModal.jsx
│   └── PrivateRoute.jsx
├── context/         # React Context
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Users.jsx
├── utils/           # Utilities
│   └── api.js
├── App.jsx          # Main app
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios
- React Icons
- React Toastify

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

The `dist/` folder can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service
