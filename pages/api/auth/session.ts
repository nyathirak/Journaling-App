import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'U+WLGpz3+mPYbnU+VHz7x2kGL1O0ExZzfdC7f1cyODg=';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        return res.status(200).json({});
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        return res.status(200).json({ user: decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
