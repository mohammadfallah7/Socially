const UserProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;

  throw new Error("Not implemented");

  return <div>{username} Profile Page</div>;
};

export default UserProfilePage;
