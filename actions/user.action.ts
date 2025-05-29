"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const syncUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return;

    const userExistence = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (userExistence) return;

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: user.fullName,
        image: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error in syncUser", error);
  }
};

const getUserByClerkId = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      _count: { select: { followers: true, followings: true, posts: true } },
    },
  });
};

const getDbUserId = async () => {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await getUserByClerkId(user.id);
  if (!dbUser) throw new Error("User not found");
  return dbUser.id;
};

const getRandomUsers = async (count: number = 3) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: { select: { followers: true } },
      },
      take: count,
    });

    return users;
  } catch (error) {
    console.error("Error in get random users", error);
  }
};

const toggleFollow = async (targetUserId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    if (targetUserId === userId) throw new Error("You can't follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            creatorId: userId,
            userId: targetUserId,
            type: "FOLLOW",
          },
        }),
      ]);
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error in toggle follow", error);
    return { success: false, error };
  }
};

export {
  getDbUserId,
  getRandomUsers,
  getUserByClerkId,
  syncUser,
  toggleFollow,
};
