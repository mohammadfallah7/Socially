import { LucideLoader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-[calc(100vh-15rem)] flex flex-col items-center justify-center gap-5">
      <LucideLoader2 size={30} className="animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Loading;
