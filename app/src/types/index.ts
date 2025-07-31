export type USER_TYPE = "USER" | "ADMIN";

export interface SortConfigType {
	key?: string;
	direction?: string;
}

export type SignUpApiResponseType = {
	message: string;
	data: {
		data: {
			user: {
				name: {
					first: string;
					last: string;
				};
				email: string;
				oauth: string;
				roles: string;
				companyRef: string;
			};
		};
	};
};

export type NSignUpApiResponseType = {
	message: string;
	data: {
		user: {
			name: {
				first: string;
				last: string;
			};
			email: string;
			oauth: string;
			roles: string;
			companyRef: string;
		};
		token?: string;
	};
};

export interface PaginatedSearchQuery {
	page?: number;
	pageSize?: number;
	searchValue?: string;
	sortBy?: boolean;
	companyRef: string;
}

export interface SearchBoxProps {
	value: string;
	variant: string;
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type PaginationType = {
	page: number;
	pageSize: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
	handlePageSizeChange?: (page: number) => void;
	totalDocs?: number;
};

// ------
// Enums
// ------
export enum ROLES {
	SUPER_ADMIN = "SUPER_ADMIN",
	ADMIN = "ADMIN",
	USER = "USER",
	SYSTEM = "SYSTEM",
}

export enum STATUS {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum COOKIES {
	TOKEN = "token", // this is set from backend and its mainly used for authentication.
	USER_TYPE = "userType",
	COMPANY_REF = "companyRef",
	IS_ADMIN_PATH = "isAdminPath",
}
