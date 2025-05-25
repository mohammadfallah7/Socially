import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const HomePage = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default HomePage;
