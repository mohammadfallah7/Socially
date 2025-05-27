const HomePage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="col-span-1 lg:col-span-6">Create post</div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        Who to follow
      </div>
    </div>
  );
};

export default HomePage;
