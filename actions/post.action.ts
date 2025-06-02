"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

const createPost = async (content: string, image: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content,
        image,
      },
    });

    revalidatePath("/");

    return { success: true, post };
  } catch (error) {
    console.error("Error While creating post", error);
    return { success: false, error };
  }
};

const getPosts = async () => {
  try {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, name: true, image: true, username: true },
            },
          },
        },
        likes: { select: { userId: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  } catch (error) {
    console.error("Error While getting posts", error);
    throw new Error("Failed to get posts");
  }
};

const toggleLike = async (postId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const isLiked = await prisma.like.findUnique({
      where: { userId_postId: { postId, userId } },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");

    if (isLiked) {
      await prisma.like.delete({
        where: { userId_postId: { postId, userId } },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({ data: { postId, userId } }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  postId,
                  creatorId: userId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error While liking post", error);
    return { success: false, error };
  }
};

const createComment = async (postId: string, content: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (!content) throw new Error("Comment cannot be empty");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newComment = await tx.comment.create({
          data: { postId, authorId: userId, content },
        });

        if (post.authorId !== userId) {
          await tx.notification.create({
            data: {
              type: "COMMENT",
              creatorId: userId,
              commentId: newComment.id,
              userId: post.authorId,
              postId,
            },
          });
        }

        return [newComment];
      }
    );

    revalidatePath("/");

    return { success: true, comment };
  } catch (error) {
    console.error("Error While creating comment", error);
    return { success: false, error };
  }
};

const deletePost = async (postId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");
    if (userId !== post.authorId) throw new Error("Unauthorized - No Access");

    await prisma.post.delete({ where: { id: postId } });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error While deleting post", error);
    return { success: false, error };
  }
};

export { createComment, createPost, deletePost, getPosts, toggleLike };
