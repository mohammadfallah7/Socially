"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

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
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error in syncUser", error);
  }
};

export { syncUser };
