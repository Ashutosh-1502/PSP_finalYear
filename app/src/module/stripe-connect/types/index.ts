import type { PaginatedSearchQuery } from "@/types";
import { z } from "zod";

// ------------------
// react-query types
// ------------------
export type PostAccountResponseType = {
	success: boolean;
	message: string;
	data: { accountId: string };
	errors: object;
};

export type PostAccountSessionResponseType = {
	success: boolean;
	message: string;
	data: { clientSecret: string };
	errors: object;
};

export type PostAccountSessionType = {
	accountId: string;
};

export type GetAllProductsResponseType = {
	success: boolean;
	message: string;
	data: ProductInfo[];
	errors: object;
};

export type ProductInfo = {
	_id: string;
	title: string;
	price: number;
};

export type PostPaymentIntentResponseType = {
	success: boolean;
	message: string;
	data: {
		clientSecret: string;
		paymentIntentId: string;
	};
	errors: object;
};

export type PostCustomerIdResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type GetAllOrdersResponseType = {
	success: boolean;
	message: string;
	data: OrderDetails[];
	errors: object;
};

type OrderDetails = {
	_id: string;
	productRef: string;
	amountPaid: number;
	orderPlacedAt: Date;
	isRefundEligible: boolean;
	daysSinceOrder: number;
	productName: string;
	refunded: boolean;
};

export type PostRefundResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type PostDashboardLinkResponseType = {
	success: boolean;
	message: string;
	data: {
		url: string;
	};
	errors: object;
};

export type PostProductType = {
	title: string;
	price: number;
};

export type PostProductResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type PostEarlyTransferResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type GetVendorResponseType = {
	success: boolean;
	message: string;
	data: VendorData | undefined;
	errors: object;
};

export type VendorData = {
	tier: TIER;
	stripeAccountId: string;
	amountOwedToPlatform: number;
};

export type GetCustomerResponseType = {
	success: boolean;
	message: string;
	data: {
		stripeCustomerId: string;
	};
	errors: object;
};

export type GetAllTransferredTransactionsResponseType = {
	success: boolean;
	message: string;
	data: {
		data: TransferredTransactionType[];
		has_more: boolean;
	};
	errors: object;
};

export type TransferredTransactionType = {
	id: string;
	type: "refund" | "charge" | string;
	net: number; // => (net = amount - fee);
	amount: number;
	fee: number; // stripe fee
	currency: string;
	description: string;
	source: string;
	created: number;
};

export type GetAllTransferredTransactionsType = {
	limit: number;
	startingAfter?: string;
	endingBefore?: string;
	page: number;
};

export type GetAllTransactionsType = {
	page: number;
	pageSize: number;
};

export type GetAllTransactionsResponseType = {
	success: boolean;
	message: string;
	data: [{ items: AllTransactionType[]; total: number; page: number; pageSize: number }];
	errors: object;
};

export type AllTransactionType = {
	_id: string;
	amountPaid: number;
	paymentStatus: string;
	orderPlacedAt: string;
	refunded: boolean;
	transferStatus: string;
	amountRecoveryStatus: RECOVERY_STATUS;
};

export type GetEarningDetailsResponseType = {
	success: boolean;
	message: string;
	data: EarningDetailsType;
	errors: object;
};

export type EarningDetailsType = {
	totalEarning: number;
	totalPending: number;
	totalTransferred: number;
};

export type GetMonthlyEarningsResponseType = {
	success: boolean;
	message: string;
	data: {
		month: number;
		year: number;
		totalEarnings: number;
	}[];
	errors: object;
};

export type PostVendorType = {
	stripeAccountId: string;
	tier: TIER;
};

export type PostVendorResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type GetVendorsResponseType = {
	success: boolean;
	message: string;
	data: [{ items: VendorType[]; total: number; page: number; pageSize: number }];
	errors: object;
};

export type VendorType = {
	_id: string;
	stripeAccountId: string;
	tier: TIER;
	userRef: {
		email: string;
	};
};

export type PaginatedVendorSearchQuery = Omit<PaginatedSearchQuery, "companyRef">;

export type VendorTierChangeAlertType = {
	vendor: VendorType;
	handleUpdate: (stripeAccountId: string, tier: TIER) => void;
};

// ----------------
// component types
// ----------------
export type VendorOnboardingType = {
	accountId: string;
};

export type RefundAlertType = {
	order: OrderDetails;
	handleRefund: (id: string) => void;
};

export type CreateProductModalType = {
	stripeAccountId: string | undefined;
};

export type CursorType = {
	startingAfter?: string;
	endingBefore?: string;
};

export type PageChangeType = {
	newPage: number;
	startingAfter?: string;
	endingBefore?: string;
};

export type TransferredTransactionsTableType = {
	isSuccess: boolean;
	transactions: { data: TransferredTransactionType[]; has_more: boolean } | undefined;
	size: "sm" | "md" | "lg";
};

export type TransferredTransactionsTableFooterType = {
	page: number;
	pageSize: number;
	handlePageChange: (params: PageChangeType) => void;
	handlePageSizeChange: (newPageSize: number) => void;
	transactions:
		| {
				data: TransferredTransactionType[];
				has_more: boolean;
		  }
		| undefined;
};

export type AllTransactionsTableType = {
	isSuccess: boolean;
	size: "sm" | "md" | "lg";
	transactions: AllTransactionType[] | undefined;
	vendorTier: TIER | undefined;
};

export type AllTransactionsTableFooterType = {
	page: number;
	pageSize: number;
	handlePageChange: (newPage: number) => void;
	handlePageSizeChange: (newPageSize: number) => void;
	transactions: AllTransactionType[] | undefined;
	totalPages: number;
};

export type InfoIconType = {
	label: string;
};

export type EarlyTransferAlertType = {
	vendorData: VendorData;
	handleEarlyTransfer: () => void;
	transferInProgress: boolean;
	earningDetails: EarningDetailsType | undefined;
};

// ------
// enums
// ------
export enum APPEARANCE {
	STRIPE = "stripe",
	FLOATING = "floating",
}

export enum TRANSACTION_TYPE {
	PAYMENT = "payment",
	PAYOUT = "payout",
}

export enum NOT_APPLICABLE {
	N_A = "N/A",
}

export enum REFUND_STATUS {
	YES = "Yes",
	NO = "No",
}

export enum TIER {
	TIER1 = "tier1",
	TIER2 = "tier2",
}

export enum RECOVERY_STATUS {
	RECOVERED = "recovered",
	PARTIALLY_RECOVERED = "partially_recovered",
	NOT_APPLICABLE = "not_applicable",
}

// -------------------
// form related types
// -------------------
export const productFormSchema = z.object({
	title: z.string().min(1, { message: "This field is required" }),
	price: z
		.string()
		.min(1, { message: "This field is required" })
		.refine((value) => !isNaN(parseFloat(value)) && isFinite(Number(value)), {
			message: "Price must be a valid number",
		})
		.transform((value) => parseFloat(value)),
});

export type CreateProductType = z.infer<typeof productFormSchema>;
