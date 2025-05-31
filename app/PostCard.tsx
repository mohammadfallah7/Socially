"use client";

import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { LucideHeart, LucideMessageCircle, LucideSend } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Comment = Posts[number]["comments"][number];

interface IPostCardProps {
  post: Posts[number];
  dbUserId: string | null;
}

const PostCard: React.FC<IPostCardProps> = ({ post, dbUserId }) => {
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((l: { userId: string }) => l.userId === dbUserId)
  );

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev: boolean) => !prev);
      setOptimisticLikes((prev: number) => prev + (hasLiked ? -1 : 1));

      await toggleLike(post.id);
    } catch (error) {
      console.error("Error in like post", error);
      setOptimisticLikes(post._count.likes);
      setHasLiked(
        post.likes.some((l: { userId: string }) => l.userId === dbUserId)
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;

    try {
      setIsCommenting(true);
      const res = await createComment(post.id, newComment);
      if (res?.success) {
        toast.success("Comment added successfully");
        setNewComment("");
      }
    } catch (error) {
      console.error("Error in add comment", error);
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const res = await deletePost(post.id);
      if (res?.success) toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error in delete post", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex gap-3 sm:gap-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:size-10">
                <AvatarImage
                  src={post.author.image || "/avatar.png"}
                  alt={post.author.username}
                />
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 truncate">
                  {post.author.name && (
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="font-semibold truncate"
                    >
                      {post.author.name}
                    </Link>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>.</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.content || "Post Content"}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground transition-colors ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
                disabled={isLiking}
              >
                {hasLiked ? (
                  <LucideHeart className="size-5 fill-current" />
                ) : (
                  <LucideHeart className="size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <LucideHeart className="size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
              </SignInButton>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-blue-500"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <LucideMessageCircle
                className={`size-5 ${
                  showComments && "fill-blue-500 text-blue-500"
                }`}
              />
              <span>{post._count.comments}</span>
            </Button>
          </div>

          {showComments && (
            <div className="space-y-4 border-t">
              <div className="space-y-4 mt-4">
                {post.comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage
                        src={comment.author.image || "/avatar.png"}
                        alt={comment.author.username}
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {comment.author.name && (
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          @{comment.author.username}
                        </span>
                        <span className="text-sm text-muted-foreground">.</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              {user && (
                <div className="flex gap-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage
                      src={user.imageUrl || "/avatar.png"}
                      alt={user.fullName || "Username"}
                    />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      className="resize-none min-h-[80px]"
                      placeholder="Write a comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        className="flex items-center gap-2"
                        disabled={isCommenting || !newComment.trim()}
                      >
                        {isCommenting ? (
                          "Posting..."
                        ) : (
                          <>
                            <LucideSend className="size-4" />
                            Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
