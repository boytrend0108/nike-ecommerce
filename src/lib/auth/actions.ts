import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { auth } from "./config";
// import { db } from "../db";
// import { guest } from "../db/schema";
// import { eq } from "drizzle-orm";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUpAction(formData: FormData) {
  'use server';
  
  const rawData = {
    name: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signUpSchema.parse(rawData);

  console.log("Sign up attempt:", validatedData);
  
  const mockUserId = crypto.randomUUID();
  await mergeGuestCartWithUserCart(mockUserId);

  redirect("/");
}

export async function signInAction(formData: FormData) {
  'use server';
  
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signInSchema.parse(rawData);

  console.log("Sign in attempt:", validatedData);
  
  const mockUserId = crypto.randomUUID();
  await mergeGuestCartWithUserCart(mockUserId);

  redirect("/");
}

export async function signOut() {
  'use server';
  
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    redirect("/");
  } catch {
    return { error: "Failed to sign out" };
  }
}

export async function createGuestSession() {
  'use server';
  
  try {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    console.log("Creating guest session:", { sessionToken, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, sessionToken };
  } catch {
    return { error: "Failed to create guest session" };
  }
}

export async function getGuestSession() {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return null;
    }

    console.log("Getting guest session:", sessionToken);
    
    return {
      id: crypto.randomUUID(),
      sessionToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  } catch {
    return null;
  }
}

export async function mergeGuestCartWithUserCart(userId: string) {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;

    if (!sessionToken) {
      return { success: true };
    }

    console.log("Merging guest cart for user:", userId);

    console.log("Deleting guest session:", sessionToken);
    cookieStore.delete("guest_session");

    return { success: true };
  } catch {
    return { error: "Failed to merge guest cart" };
  }
}

export async function getCurrentSession() {
  'use server';
  
  try {
    console.log("Getting current session");
    
    const guestSession = await getGuestSession();
    if (guestSession) {
      return {
        type: "guest" as const,
        guest: guestSession,
      };
    }

    return null;
  } catch {
    return null;
  }
}
