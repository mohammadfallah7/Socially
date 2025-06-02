"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";

const getNotifications = async () => {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: { id: true, name: true, image: true, username: true },
        },
        comment: {
          select: { id: true, content: true, createdAt: true },
        },
        post: {
          select: { id: true, content: true, image: true },
        },
      },
    });
  } catch (error) {
    console.error("Error in get notifications", error);
    throw new Error("Failed to get notifications");
  }
};

const markNotificationsAsRead = async (notificationIds: string[]) => {
  try {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in mark notifications as read", error);
    throw new Error("Failed to mark notifications as read");
  }
};

export { getNotifications, markNotificationsAsRead };
