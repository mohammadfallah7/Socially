"use client";

import { Button } from "@/components/ui/button";
import { LucideBug } from "lucide-react";
import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center gap-5">
      <LucideBug size={50} />
      <p className="text-muted-foreground">Something went wrong!</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
};

export default ErrorPage;
