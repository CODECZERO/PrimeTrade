import { config } from 'dotenv';
config();

import app from './app.js';
import prisma from './db/prisma.db.js';

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        console.error('Please check:');
        console.error('1. Database server is running');
        console.error('2. DATABASE_URL in .env is correct');
        console.error('3. Network connection is stable');
        console.error('4. Connection pool is not exhausted');
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing database connection...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing database connection...');
    await prisma.$disconnect();
    process.exit(0);
});

connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Task Manager API Server (TypeScript + Prisma)         ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║   Port: ${PORT}                                             ║
║   Database: PostgreSQL with Prisma ORM                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        `);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
