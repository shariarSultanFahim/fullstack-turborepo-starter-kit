import Link from "next/link";

import { ArrowLeft, FileQuestion } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <Card className="max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
            <FileQuestion className="text-muted-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you are looking for does not exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
