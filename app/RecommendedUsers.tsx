import { getRandomUsers } from "@/actions/user.action";
import FollowButton from "@/components/FollowButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const RecommendedUsers = async () => {
  const users = await getRandomUsers();

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage
                      src={user.image || "/avatar.png"}
                      alt={user.username}
                    />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  {user.name && (
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium cursor-pointer"
                    >
                      {user.name}
                    </Link>
                  )}
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} Followers
                  </p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
        {users?.length === 0 && (
          <p className="text-muted-foreground text-center">
            There is no suggest for you yet!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
