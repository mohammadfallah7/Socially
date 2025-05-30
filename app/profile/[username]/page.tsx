import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePage from "./ProfilePage";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const user = await getProfileByUsername(username);

  return {
    title: "Socially | " + `${user?.name ?? user?.username}`,
    description: `${user?.bio}`,
  };
}

const UserProfilePage = async ({
  params,
}: {
  params: { username: string };
}) => {
  const { username } = params;

  const user = await getProfileByUsername(username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePage
      targetUser={user}
      posts={posts}
      likedPosts={likedPosts}
      initialIsFollowing={isCurrentUserFollowing}
    />
  );
};

export default UserProfilePage;
