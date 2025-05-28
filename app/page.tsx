import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "./CreatePost";
import RecommendedUsers from "./RecommendedUsers";

const HomePage = async () => {
  const user = await currentUser();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="col-span-1 lg:col-span-6">{user && <CreatePost />}</div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        {user && <RecommendedUsers />}
      </div>
    </div>
  );
};

export default HomePage;
