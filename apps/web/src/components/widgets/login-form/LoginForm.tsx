"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowRight, KeyRound, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginInput } from "@repo/validators";

import { useLoginMutation } from "@/hooks";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/ui";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const loginMutation = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const fillDemoCredentials = () => {
    form.setValue("email", "admin@example.com", { shouldValidate: true });
    form.setValue("password", "123456", { shouldValidate: true });
  };

  const onSubmit = (values: LoginInput) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push(from);
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Demo Credentials Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Default Demo Credentials</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Seeded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-1">
          <div className="bg-background/80 space-y-1 rounded-md border p-2.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground font-semibold">admin@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Password:</span>
              <span className="text-foreground font-semibold">123456</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemoCredentials}
            className="border-primary/30 hover:bg-primary/10 w-full"
          >
            <KeyRound className="text-primary mr-2 h-3.5 w-3.5" />
            1-Click Fill Demo Credentials
          </Button>
        </CardContent>
      </Card>

      {/* Main Login Card */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your monorepo dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          autoComplete="email"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-muted-foreground flex flex-col items-center justify-center gap-2 border-t pt-4 text-sm">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
          <Link href="/" className="text-xs hover:underline">
            ← Back to Monorepo Overview
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
