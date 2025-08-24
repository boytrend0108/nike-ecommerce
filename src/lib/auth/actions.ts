import { AuthFormData } from "@/components/AuthFormClient";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "./config";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUpAction(formData: AuthFormData) {
  'use server';
  
  const rawData = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  };

  const validatedData = signUpSchema.parse(rawData);

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      }
    });

    if (result.user) {
      await mergeGuestCartWithUserCart(result.user.id);
      return {ok: true, userId: result.user.id};
    }
  } catch (err) {
    console.error("Sign up error:", err);
  }


}

export async function signInAction(formData: AuthFormData) {
  'use server';
  
  const rawData = {
    email: formData.email,
    password: formData.password,
  };

  
  const validatedData = signInSchema.parse(rawData);

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      }
    });

    if (result.user) {
      await mergeGuestCartWithUserCart(result.user.id);
      return { ok: true, userId: result.user.id };
    }
  } catch (error) {
    console.error("Sign in error:", error);
    throw new Error("Invalid credentials");
  }
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

export async function getCurrentUser() {
  try {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
return session?.user || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
