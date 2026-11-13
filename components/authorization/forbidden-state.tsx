import Link from "next/link";

export function ForbiddenState({ orgSlug }: { orgSlug: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <h1 className="text-lg font-semibold">Access denied</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You do not have permission to access this workspace page.
      </p>
      <Link
        href={`/${orgSlug}/dashboard`}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
