import { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'U+WLGpz3+mPYbnU+VHz7x2kGL1O0ExZzfdC7f1cyODg=';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (!["GET", "POST", "PUT", "DELETE"].includes(req.method!)) {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
        console.log("Unauthorized request. No token found.");
        return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, SECRET) as JwtPayload;
    } catch (error) {
        console.log("Invalid or expired token.");
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (typeof decoded !== 'object' || !('userId' in decoded)) {
        return res.status(400).json({ message: "User ID is missing from token" });
    }

    const userId = decoded.userId;
    console.log("Token User ID:", userId);

    if (req.method === 'GET') {
        try {
            const journals = await prisma.journal.findMany();
            res.status(200).json(journals);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching journals' });
        }
    } else if (req.method === "POST") {
        const { title, content, category } = req.body;
        console.log("Received Data:", req.body);

        if (!title || !content || !category) {
            console.log("Missing required fields.");
            return res.status(400).json({ message: "Title, content, and category are required" });
        }

        try {
            const newJournal = await prisma.journal.create({
                data: {
                    userId: userId,
                    title,
                    content,
                    category,
                },
            });

            console.log("New Journal Created:", newJournal);
            return res.status(201).json(newJournal);
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error", error });
        }
    } else if (req.method === "PUT") {
        const { id, title, content, category } = req.body;
        console.log("Received Data for Update:", req.body);

        if (!id || !title || !content || !category) {
            console.log("Missing required fields.");
            return res.status(400).json({ message: "ID, title, content, and category are required" });
        }

        try {
            const updatedJournal = await prisma.journal.update({
                where: { id },
                data: { title, content, category },
            });

            console.log("Journal Updated:", updatedJournal);
            return res.status(200).json(updatedJournal);
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error", error });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;
        console.log("Received Data for Deletion:", req.body);

        if (!id) {
            console.log("Missing required fields.");
            return res.status(400).json({ message: "ID is required" });
        }

        try {
            await prisma.journal.delete({
                where: { id },
            });

            console.log("Journal Deleted:", id);
            return res.status(200).json({ message: "Journal entry deleted" });
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error", error });
        }
    }
}