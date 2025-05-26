import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  LucideBell,
  LucideHome,
  LucideLogOut,
  LucideMenu,
  LucideUser,
} from "lucide-react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";

const MobileNav = async () => {
  const user = await currentUser();

  return (
    <div className="flex md:hidden items-center gap-3">
      <ModeToggle variant="ghost" />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <LucideMenu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6">
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link href="/">
                <LucideHome className="w-4 h-4" />
                Home
              </Link>
            </Button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild
                >
                  <Link href="/notifications">
                    <LucideBell className="w-4 h-4" />
                    Notifications
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild
                >
                  <Link
                    href={`/profile/${
                      user.username ??
                      user.emailAddresses[0].emailAddress.split("@")[0]
                    }`}
                  >
                    <LucideUser className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start"
                  >
                    <LucideLogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" className="w-full">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
