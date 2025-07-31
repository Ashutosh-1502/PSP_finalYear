export type UserLoginDataType = {
	email: string;
	password: string;
};

export type LoginResponseType = {
	status: number;
	message: string;
	data: {
		token: string;
		user: {
			roles: string;
			companyRef: string;
		};
	};
};

export type LogoutResponseType = {
	status: number;
	message: string;
	data: object;
	error: object;
};

export type ForgetPassowrdDataType = {
	email: string;
};

export type PasswordResponseType = {
	status: number;
	message: string;
};

export type UserRegisterDataType = {
	name: {
		first: string;
		last: string;
	};
	email: string;
	password: string;
	confirmPassword: string;
	roles?: string;
	token?: string;
};

export type RegisterResponseType = {
	status: number;
};

export type ResetPasswordResponseType = {
	token: string;
	email?: string;
	password?: string;
};

export type ResetPasswordDataType = {
	email: string;
	password: string;
	confirmedPassword: string;
};

export type CookiesDataType = {
	user: {
		roles: string;
		companyRef?: string;
	};
	token?: string;
};

export interface AcceptInviteData {
	inviteToken: string;
}

export interface EmailResponseType {
	data: string;
}

export type UserMetadataType = {
	full_name: string;
};

export type OauthProviders = (typeof OAUTH_PROVIDER)[keyof typeof OAUTH_PROVIDER];

export type PopupConfig = {
	width: number;
	height: number;
	left: number;
	top: number;
};

// -----
// ENUMS
// -----
export enum OAUTH_PROVIDER {
	GOOGLE = "google",
	APPLE = "apple",
}
