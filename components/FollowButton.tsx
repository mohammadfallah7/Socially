"use client";

import { toggleFollow } from "@/actions/user.action";
import { LucideLoader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

const FollowButton = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const { success } = await toggleFollow(userId);
      if (success) toast.success("User followed successfully");
    } catch (error) {
      console.error("Error in follow user", error);
      toast.error("Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? <LucideLoader2 className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
};

export default FollowButton;
