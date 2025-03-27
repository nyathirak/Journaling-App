import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth"; // Ensure the path is correct

export default NextAuth(authOptions);
