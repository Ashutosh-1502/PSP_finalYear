import { COOKIES, ROLES } from "@/types";
import type {CookiesDataType } from "@/module/auth/types";
import Cookies from "js-cookie";
import { routes } from "@/config/routes";

export const isPasswordValid = (password: string): boolean => {
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
	return passwordRegex.test(password);
};

export function redirectUser(userType: string) {
	switch (userType) {
		case ROLES.ADMIN:
			return routes.admin.dashboard;
		case ROLES.USER:
			return routes.user.dashboard;
		default:
			return routes.signIn;
	}
}

// --------------
// cookie helpers
// --------------
export function setCookies(data: CookiesDataType) {
	Cookies.set(COOKIES.USER_TYPE, data.user.roles, { expires: 1 });
	if (data.token) Cookies.set(COOKIES.TOKEN, data.token, { expires: 1 });
	if (data.user.roles !== ROLES.SYSTEM && data.user.companyRef) {
		Cookies.set(COOKIES.COMPANY_REF, data.user.companyRef, { expires: 1 });
	}

	console.log("cookies are set");
}

export function clearCookies() {
	Cookies.remove(COOKIES.TOKEN);
	Cookies.remove(COOKIES.USER_TYPE);
	Cookies.remove(COOKIES.COMPANY_REF);
	Cookies.remove(COOKIES.IS_ADMIN_PATH);
}

export function getCookies() {
	const token = Cookies.get(COOKIES.TOKEN);
	const userType = Cookies.get(COOKIES.USER_TYPE);
	const companyRef = Cookies.get(COOKIES.COMPANY_REF);
	const isAdminPath = Cookies.get(COOKIES.IS_ADMIN_PATH);
	console.log(userType, companyRef, isAdminPath, token);
	return { userType, companyRef, isAdminPath, token };
}
