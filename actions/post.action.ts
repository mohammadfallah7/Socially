"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

const createPost = async (content: string, image: string) => {
  try {
    const userId = await getDbUserId();
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

export { createPost };
