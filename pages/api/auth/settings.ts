import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else if (req.method === "POST") {
    const { email, name } = req.body;

    try {
      const updatedUser = await prisma.users.update({
        where: { email },
        data: { name },
      });

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}