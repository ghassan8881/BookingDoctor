// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export default async function middleware(request) {
//   const token = await getToken({ req: request });
//   const { pathname } = request.nextUrl;

//   // Protected routes
//   const protectedRoutes = ["/dashboard", "/profile"];
//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtected && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Auth routes
//   const authRoutes = ["/login", "/register"];
//   const isAuthRoute = authRoutes.includes(pathname);

//   if (isAuthRoute && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // لو المستخدم مو مسجل دخول يتحول إلى /login
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
