import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, name } = req.body;

    try {
        console.log("🔍 Checking for existing user...");
        console.log("Request Data:", req.body);

        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("❌ User already exists.");
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log("🔒 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("✅ Creating new user...");
        const newUser = await prisma.users.create({
            data: { email, password: hashedPassword, name },
        });

        console.log("🎉 User created successfully!");
        return res.status(201).json({ user: newUser });

    } catch (error) {
        console.error("❌ Signup error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: (error as any).message });
    }
}