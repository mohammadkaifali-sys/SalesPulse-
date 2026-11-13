"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/auth-schema";

export async function signupAction(input: unknown) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid signup details",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      success: false as const,
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        avatarUrl: null,
      },
    });
  } catch {
    return {
      success: false as const,
      error: "Unable to create your account. Please try again.",
    };
  }

  return { success: true as const };
}
