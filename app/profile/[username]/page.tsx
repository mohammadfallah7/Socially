const UserProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = params;

  return <div>{username} Profile Page</div>;
};

export default UserProfilePage;
