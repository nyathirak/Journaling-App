import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

// Secret key used to sign/verify JWTs
const SECRET = process.env.NEXTAUTH_SECRET || 'U+WLGpz3+mPYbnU+VHz7x2kGL1O0ExZzfdC7f1cyODg=';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Parse cookies from the request header
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    // If no token is found, return an empty response
    if (!token) {
        return res.status(200).json({});
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, SECRET);
        // Respond with the decoded user information
        return res.status(200).json({ user: decoded });
    } catch (error) {
        // If verification fails
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}