import { getPosts } from "@/actions/post.action";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import RecommendedUsers from "./RecommendedUsers";
import { getDbUserId } from "@/actions/user.action";

const HomePage = async () => {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="col-span-1 lg:col-span-6">
        {user && <CreatePost />}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4">
        <RecommendedUsers />
      </div>
    </div>
  );
};

export default HomePage;
