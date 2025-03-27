import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'U+WLGpz3+mPYbnU+VHz7x2kGL1O0ExZzfdC7f1cyODg=';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600, // 1 hour
    }));

    res.status(200).json({ user: { email: user.email, name: user.name } });
}
