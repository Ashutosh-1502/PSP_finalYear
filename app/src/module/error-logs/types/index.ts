// ------------------
// react-query types
// ------------------
export type UserLoginDataType = {
	email: string;
	password: string;
};

export type LoginResponseType = {
	success: boolean;
	message: string;
	data: {
		user: {
			roles: string;
		};
	};
	errors: object;
};

export type GetAllErrorLogsResponseType = {
	success: boolean;
	message: string;
	data: [{ items: ErrorLogInfo[]; total: number; page: number; pageSize: number }];
	errors: object;
};

type RequestValue = string | number | boolean | null | undefined;

export type ErrorLogInfo = {
	_id: string;
	name: string;
	message: string;
	stackTrace: string;
	type: ERROR_TYPE;
	request?: {
		method: HTTP_METHOD;
		statusCode: number;
		url: string;
		path: string;
		headers: Record<string, string>;
		body: Record<string, RequestValue | RequestValue[]>;
		query: Record<string, string | string[]>;
		params: Record<string, string>;
	};
	context?: {
		userRef: string;
		userAgent: string;
		ip: string;
	};
	isImportant: boolean;
	createdAt: string;
};

export type ErrorLogSearchQuery = {
	page: number;
	pageSize: number;
	sortBy: SORT_BY;
	errorType: ERROR_TYPE;
	startDate?: Date | string;
	endDate?: Date | string;
};

export type UpdateErrorLogType = {
	id: string;
	isImportantFlag: boolean;
};

// ----------------
// component types
// ----------------
export type PaginationType = {
	page: number;
	pageSize: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
	handlePageSizeChange: (page: number) => void;
};

// ------
// enums
// ------
export enum ERROR_TYPE {
	GENERIC = "generic",
	EMAIL = "email",
}

export enum HTTP_METHOD {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	PATCH = "PATCH",
}

export enum SORT_BY {
	OLDEST = "oldest",
	NEWEST = "newest",
}

export enum NOT_APPLICABLE {
	N_A = "N/A",
}
