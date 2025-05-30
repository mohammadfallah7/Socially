"use client";

import { createPost } from "@/actions/post.action";
import ImageUpload from "@/components/ImageUpload";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { LucideImage, LucideLoader2, LucideSend } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { user } = useUser();
  const [createPostForm, setCreatePostForm] = useState({
    content: "",
    image: "",
  });
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!createPostForm.content.trim() && !createPostForm.image) return;
    setIsPosting(true);

    try {
      const res = await createPost(
        createPostForm.content,
        createPostForm.image
      );

      if (res?.success) {
        setCreatePostForm({ content: "", image: "" });
        setShowImageUpload(false);
        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Error in create post", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user.imageUrl || "/avatar.png"}
                alt={user.fullName || user.emailAddresses[0].emailAddress}
              />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={createPostForm.content}
              onChange={(e) =>
                setCreatePostForm({
                  ...createPostForm,
                  content: e.target.value,
                })
              }
              disabled={isPosting}
            />
          </div>
          {/* TODO: Handle image upload */}

          {(showImageUpload || createPostForm.image) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={createPostForm.image}
                onChange={(url) =>
                  setCreatePostForm({ ...createPostForm, image: url })
                }
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <LucideImage className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              size="sm"
              className="flex items-center"
              onClick={handleSubmit}
              disabled={
                (!createPostForm.content.trim() && !createPostForm.image) ||
                isPosting
              }
            >
              {isPosting ? (
                <>
                  <LucideLoader2 className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <LucideSend className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
