import { config } from 'dotenv';
config();

import prisma from './prisma.db.js';
import bcrypt from 'bcrypt';

async function seed() {
    try {
        console.log('Seeding database...');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                username: 'admin',
                email: 'admin@example.com',
                password: adminPassword,
                role: 'ADMIN'
            }
        });

        // Create regular user
        const userPassword = await bcrypt.hash('user123', 10);
        const user = await prisma.user.upsert({
            where: { email: 'user@example.com' },
            update: {},
            create: {
                username: 'john_doe',
                email: 'user@example.com',
                password: userPassword,
                role: 'USER'
            }
        });

        // Create sample tasks for the user
        await prisma.task.createMany({
            data: [
                {
                    title: 'Complete project documentation',
                    description: 'Write comprehensive documentation for the API',
                    status: 'IN_PROGRESS',
                    priority: 'HIGH',
                    userId: user.id,
                    dueDate: new Date('2024-12-31')
                },
                {
                    title: 'Review pull requests',
                    description: 'Review and merge pending pull requests',
                    status: 'PENDING',
                    priority: 'MEDIUM',
                    userId: user.id
                },
                {
                    title: 'Update dependencies',
                    description: 'Update all npm packages to latest versions',
                    status: 'COMPLETED',
                    priority: 'LOW',
                    userId: user.id
                }
            ]
        });

        console.log('Database seeded successfully');
        console.log('\nTest Credentials:');
        console.log('Admin - Email: admin@example.com, Password: admin123');
        console.log('User  - Email: user@example.com, Password: user123');

    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed();
