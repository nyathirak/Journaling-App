import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get a user by their email.
 * @param email - The email of the user.
 * @returns The user object or null if not found.
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * Update the name of a user.
 * @param email - The email of the user.
 * @param newName - The new name to update.
 * @returns The updated user object.
 */
export async function updateUserName(email: string, newName: string) {
  try {
    const updatedUser = await prisma.users.update({
      where: { email },
      data: { name: newName },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
}