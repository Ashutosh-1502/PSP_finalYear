import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIES, ROLES } from "@/types";
import { routes } from "@/config/routes";

interface Permissions {
	[endpoint: string]: string[];
}

const permissions: Permissions = {
	subscriptions: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
	company: [ROLES.SUPER_ADMIN],
	products: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
	teams: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
	"profile-settings": [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
	system: [ROLES.SYSTEM],
};

function checkAuthorization(request: NextRequest, requiredRoles: string[]): boolean {
	const userType = request.cookies.get(COOKIES.USER_TYPE)?.value || "";
	return requiredRoles.includes(userType);
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const publicPaths = ["/signin", "/signup", "/forgot-password", "/system/signin"];
	const isPublicPath = publicPaths.includes(path);
	const token = request.cookies.get(COOKIES.TOKEN)?.value || "";
	const userType = request.cookies.get(COOKIES.USER_TYPE)?.value || "";

	const Redirect = () => {
		if (token) {
			switch (userType) {
				case ROLES.SUPER_ADMIN:
					return NextResponse.redirect(new URL(routes.superAdmin.dashboard, request.url));
				case ROLES.ADMIN:
					return NextResponse.redirect(new URL(routes.admin.dashboard, request.url));
				case ROLES.USER:
					return NextResponse.redirect(new URL(routes.user.dashboard, request.url));
			}
		}
		return NextResponse.redirect(new URL(routes.signIn, request.url));
	};

	if (token && isPublicPath) {
		// If trying to access public paths with a token, redirect to dashboard
		return Redirect();
	}

	if (!token && !isPublicPath) {
		// If trying to access private paths without a token, redirect to signin
		return Redirect();
	}

	if (
		// Redirect users to their designated dashboards if they attempt to access unauthorized routes.
		(token && path.startsWith("/super-admin") && userType !== ROLES.SUPER_ADMIN) ||
		(token && path.startsWith("/admin") && userType === ROLES.USER) ||
		(token && path.startsWith("/system") && userType !== ROLES.SYSTEM)
	) {
		return Redirect();
	}

	// Additional authorization checks
	// Endpoint extraction
	const pathSegments = path.split("/");
	const endpoint = pathSegments.length >= 3 ? pathSegments[2] : null;

	// Authorization using the extracted endpoint
	const allowedRoles = endpoint ? permissions[endpoint] : undefined;
	if (allowedRoles && !checkAuthorization(request, allowedRoles)) {
		return Redirect();
	}

	// Default behavior: allow the request to proceed
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/signin",
		"/signup",
		"/",
		"/admin/:path*",
		"/super-admin/:path*",
		"/user/:path*",
		"/system/:path*",
		"/profile/other-components",
		"/profile/products/:path*",
		"/profile/profile-settings/:path*",
		"/profile/subscriptions/:path*",
		"/profile/teams",
	],
};
