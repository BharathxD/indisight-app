import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/server";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== UserRole.SUPER_ADMIN)
    return NextResponse.redirect(new URL("/auth", request.url));
  if (!session) return NextResponse.redirect(new URL("/auth", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
