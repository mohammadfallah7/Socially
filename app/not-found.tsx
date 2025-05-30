import { LucideGhost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-15rem)] flex flex-col items-center justify-center gap-5">
      <LucideGhost size={150} />
      <p className="text-muted-foreground">Could not find requested resource</p>
    </div>
  );
};

export default NotFound;
