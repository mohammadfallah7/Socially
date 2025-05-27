import { getUserByClerkId } from "@/actions/user.action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { LucideLink, LucideMapPin } from "lucide-react";
import Link from "next/link";

const UnAuthenticatedSidebar = () => {
  return (
    <aside className="sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mb-4">
            Login to access your profile and connect with others.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <SignInButton mode="modal">
            <Button variant="outline">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </aside>
  );
};

const Sidebar = async () => {
  const user = await currentUser();
  if (!user) return <UnAuthenticatedSidebar />;

  const dbUser = await getUserByClerkId(user.id);
  if (!dbUser) return null;

  return (
    <aside className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${dbUser.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={dbUser.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{dbUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dbUser.username}
                </p>
              </div>
            </Link>

            {dbUser.bio && (
              <p className="mt-3 text-sm text-muted-foreground">{dbUser.bio}</p>
            )}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{dbUser._count.followings}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{dbUser._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <LucideMapPin className="w-4 h-4 mr-2" />
                {dbUser.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LucideLink className="w-4 h-4 mr-2 shrink-0" />
                {dbUser.website ? (
                  <a
                    href={`${dbUser.website}`}
                    className="hover:underline truncate"
                    target="_blank"
                  >
                    {dbUser.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;
