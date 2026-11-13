"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { signupAction } from "@/app/actions/auth";
import { getPostAuthRedirect } from "@/app/actions/auth-redirect";
import { signupSchema, type SignupFormData } from "@/lib/auth-schema";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await signupAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setServerError("Account created, but automatic sign in failed. Please log in.");
        router.push("/login");
        return;
      }

      const destination = await getPostAuthRedirect();
      router.push(destination);
      router.refresh();
    } catch {
      setServerError("Unable to create your account right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-border/80 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your details to create your SalesPulse workspace
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-2">
          {serverError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {serverError}
            </div>
          )}
          {/* Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-foreground leading-none"
            >
              Full name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Johnson"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-foreground leading-none"
            >
              Work email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="alex@company.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-foreground leading-none"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-foreground leading-none"
            >
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-border/40">
          <Button
            type="submit"
            className="w-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
