import { z } from "zod";

// ------------------
// react-query types
// ------------------
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

export type PostRefundResponseType = {
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

// coupon types
export type PostCouponResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type CouponType = {
	id: string;
	name: string;
	amount_off: number | null;
	currency: string | null;
	duration: string;
	duration_in_months: number | null;
	max_redemptions: number | null;
	percent_off: number | null;
	redeem_by: number | null;
	times_redeemed: number;
	valid: boolean;
};

export type GetAllCouponsResponseType = {
	success: boolean;
	message: string;
	data: {
		data: CouponType[];
		has_more: boolean;
	};
	errors: object;
};

export type ListCouponsType = {
	limit?: number;
	starting_after?: string;
	ending_before?: string;
};

export type DeleteCouponResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

// promotion code types
export type PostPromotionCodeResponseType = {
	success: boolean;
	message: string;
	data: object;
	errors: object;
};

export type ListPromotionCodesType = {
	limit?: number;
	starting_after?: string;
	ending_before?: string;
};

export type PromotionCodeType = {
	id: string;
	code: string;
	expires_at?: number;
	max_redemptions?: number;
};

export type GetAllPromotionCodesResponseType = {
	success: boolean;
	message: string;
	data: {
		data: PromotionCodeType[];
		has_more: boolean;
	};
	errors: object;
};

export type GetAllPromotionCodesType = {
	couponId: string;
	limit: number;
	startingAfter?: string;
	endingBefore?: string;
	page: number;
};

// stripe checkout types
export type PostCheckoutSessionResponseType = {
	success: boolean;
	message: string;
	data: {
		clientSecret: string;
		sessionId: string;
	};
	errors: object;
};

export type GetSessionStatusResponseType = {
	success: boolean;
	message: string;
	data: {
		status: string;
		customer_email: string;
	};
	errors: object;
};

// ---------------
// component type
// ---------------
export type RefundAlertType = {
	order: OrderDetails;
	handleRefund: (id: string) => void;
};

type OrderDetails = {
	_id: string;
	productRef: string;
	amountPaid: number;
	orderPlacedAt: Date;
	productName: string;
	refunded: boolean;
};

export type CursorType = {
	startingAfter?: string;
	endingBefore?: string;
};

export type GetAllCouponsType = {
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

export type DeleteCouponAlertType = {
	id: string;
	onDeleteCoupon: (id: string) => void;
};

export type PromotionCodesType = {
	couponId: string;
};

export type CreatePromotionCodeType = {
	couponId: string;
};

export type CheckoutFormType = {
	productId: string;
};

// ------
// enums
// ------
export enum APPEARANCE {
	STRIPE = "stripe",
	FLOATING = "floating",
}

export enum COUPON_VALIDITY {
	YES = "Yes",
	NO = "No",
}

export enum NOT_APPLICABLE {
	N_A = "N/A",
}

export enum DURATION {
	FOREVER = "forever",
	ONCE = "once",
	REPEATING = "repeating",
}

export enum CURRENCY {
	USD = "usd",
}

export enum DISCOUNT_TYPE {
	AMOUNT = "amount",
	PERCENT = "percent",
}

export enum SESSION_STATUS {
	COMPLETE = "complete",
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

export const postCouponSchema = z.object({
	name: z.string().min(1, { message: "This field is required" }),
	duration: z.enum([DURATION.FOREVER, DURATION.ONCE, DURATION.REPEATING]),
	duration_in_months: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	amount_off: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) * 100 : undefined)), // multiply by 100 to convert to cents.
	currency: z.string().optional(),
	max_redemptions: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	percent_off: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
	redeem_by: z
		.string()
		.optional()
		.transform((val) => (val ? Math.floor(new Date(val).getTime() / 1000) : undefined)), // Convert to Unix timestamp
});
export type PostCouponType = z.infer<typeof postCouponSchema>;

export const postPromotionCodeSchema = z.object({
	code: z.string().min(1, { message: "This field is required" }),
	expires_at: z
		.string()
		.optional()
		.transform((val) => (val ? Math.floor(new Date(val).getTime() / 1000) : undefined)), // Convert to Unix timestamp
	max_redemptions: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : undefined)),
});
export type PostPromotionCodeSchemaType = z.infer<typeof postPromotionCodeSchema>;
export type PostPromotionCodeType = {
	coupon: string;
} & PostPromotionCodeSchemaType;
