// path/filename: pages/api/delete/[chatId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db, chats } from '@/lib/db';
import { auth } from '@clerk/nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request URL:', req.url);
  console.log('HTTP Method:', req.method)
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = await auth(req); // Authenticate the user

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const chatId = req.query.chatId as string;

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is required" });
  }

  try {
    // Using the Drizzle ORM to perform the delete operation
    const result = await db
      .delete(chats)
      .where(chats.id, "=", Number(chatId)) // Make sure to match the type of the id column in your database.
      .and(chats.userId, "=", userId)
      .execute();

    if (result.count === 0) {
      // No record was deleted
      return res.status(404).json({ error: "Chat not found or not owned by user" });
    }

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
