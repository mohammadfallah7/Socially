"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

const getProfileByUsername = async (username: string) => {
  try {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: { select: { followers: true, followings: true, posts: true } },
      },
    });
  } catch (error) {
    console.error("Error in get profile by username", error);
    throw new Error("Failed to get profile by username");
  }
};

const getUserPosts = async (userId: string) => {
  try {
    return await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  } catch (error) {
    console.error("Error in get user posts", error);
    throw new Error("Failed to get user posts");
  }
};

const getUserLikedPosts = async (userId: string) => {
  try {
    return await prisma.post.findMany({
      where: { likes: { some: { userId } } },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  } catch (error) {
    console.error("Error in get user posts", error);
    throw new Error("Failed to get user posts");
  }
};

const updateProfile = async (formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized - No Access");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    await prisma.user.update({
      where: { clerkId: user.id },
      data: { name, bio, location, website },
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error in update profile", error);
    throw new Error("Failed to update profile");
  }
};

const isFollowing = async (targetUserId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return false;

    const following = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    return !!following;
  } catch (error) {
    console.error("Error in is following", error);
    throw new Error("Failed to check if following");
  }
};

export {
  getProfileByUsername,
  getUserPosts,
  getUserLikedPosts,
  updateProfile,
  isFollowing,
};
