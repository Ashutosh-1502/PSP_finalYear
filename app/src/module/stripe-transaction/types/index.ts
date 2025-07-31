// react-query types
export type GetAllTransactionsResponseType = {
	success: boolean;
	message: string;
	data: {
		data: TransactionType[];
		has_more: boolean;
	};
	errors: object;
};

export type TransactionType = {
	id: string;
	type: "refund" | "charge" | string;
	net: number; // => (net = amount - fee);
	amount: number;
	fee: number; // stripe fee
	currency: string;
	description: string;
	source: string;
};

export type GetAllTransactionsType = {
	limit: number;
	startingAfter?: string;
	endingBefore?: string;
	page: number;
};

export type PageChangeType = {
	newPage: number;
	startingAfter?: string;
	endingBefore?: string;
};

// component types
export type TransactionsTableFooterType = {
	page: number;
	pageSize: number;
	handlePageChange: (newPage: number) => void;
	handlePageSizeChange: (newPageSize: number) => void;
	totalPages: number;
};

export type CursorType = {
	startingAfter?: string;
	endingBefore?: string;
};

export enum TRANSACTION_TYPE {
	TRANSFER = "transfer",
	REFUND = "refund",
}
