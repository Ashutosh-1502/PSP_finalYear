export type CompanyResponseType = {
	items: CompanyType[];
	total: number;
	page: number;
	pageSize: number;
};

export interface PaginatedCompanySearchQuery {
	page?: number;
	pageSize?: number;
	searchValue?: string;
}

export type CompanyType = {
	_id?: string;
	name?: string;
	companyStatus?: string;
	userRef?: string;
};

export type GetOneCompanyResponseData = {
	_id: string;
	name: string;
	companyStatus: string;
	userRef: {
		_id: string;
		name: {
			first: string;
			last: string;
		};
		fullName: string;
		email: string;
	};
};
