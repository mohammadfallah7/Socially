import Container from "@/components/Container";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-lg font-bold text-primary font-mono tracking-wider"
          >
            Socially
          </Link>

          <MobileNav />
          <DesktopNav />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
