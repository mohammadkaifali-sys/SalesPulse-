"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Globe, Loader2, ArrowRight } from "lucide-react";
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
import { createOrganizationAction } from "@/app/actions/org";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const onboardingSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name cannot exceed 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. acme-corp)"
    ),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OnboardingPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const currentSlug = watch("slug") || "your-workspace";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue("name", newName, { shouldValidate: true });
    if (!isSlugManuallyEdited) {
      setValue("slug", slugify(newName), { shouldValidate: true });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setValue("slug", slugify(e.target.value), { shouldValidate: true });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setServerError(null);
    const result = await createOrganizationAction({
      name: data.name,
      slug: data.slug,
    });

    if (!result.success) {
      setServerError(result.error || "Failed to create workspace");
      return;
    }

    // Redirect to the newly created workspace dashboard
    router.push(`/${result.slug}/dashboard`);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30 dark:bg-background">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mb-2">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Create your workspace
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Set up an isolated multi-tenant organization to start tracking sales metrics.
          </p>
        </div>

        <Card className="border-border/80 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Workspace Details</CardTitle>
            <CardDescription className="text-xs">
              You will be assigned as the Workspace Owner with full access.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              {serverError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                  {serverError}
                </div>
              )}

              {/* Workspace Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-foreground leading-none"
                >
                  Workspace Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Workspace URL Slug Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="slug"
                    className="text-xs font-medium text-foreground leading-none"
                  >
                    Workspace URL Slug
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Customizable URL
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="slug"
                    type="text"
                    placeholder="acme-corp"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.slug}
                    {...register("slug")}
                    onChange={handleSlugChange}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.slug.message}
                  </p>
                )}

                {/* URL Preview badge */}
                <div className="mt-2 flex items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground border border-border/50">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    URL:{" "}
                    <strong className="text-foreground font-mono">
                      /{currentSlug}
                    </strong>
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-4 border-t border-border/40">
              <Button
                type="submit"
                className="w-full gap-2 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Launch Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
