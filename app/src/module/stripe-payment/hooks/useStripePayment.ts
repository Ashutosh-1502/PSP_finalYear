import { apiClient } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
	GetAllProductsResponseType,
	PostProductType,
	PostProductResponseType,
	PostRefundResponseType,
	GetAllOrdersResponseType,
	GetAllPromotionCodesResponseType,
	PostPromotionCodeResponseType,
	GetAllCouponsResponseType,
	PostCouponType,
	PostCouponResponseType,
	DeleteCouponResponseType,
	GetAllCouponsType,
	GetAllPromotionCodesType,
	PostPromotionCodeSchemaType,
	PostCheckoutSessionResponseType,
	GetSessionStatusResponseType,
} from "@/module/stripe-payment/types";

const API_ADMIN_URL = "/admin/stripe-payment";
const API_USER_URL = "/stripe-payment";

export const useStripePaymentAPI = () => {
	// ------------------------
	// Products and orders api
	// ------------------------
	const usePostProductMutation = useMutation({
		mutationFn: async ({ title, price }: PostProductType) => {
			const res = await apiClient.post<PostProductResponseType>(`${API_ADMIN_URL}/product`, {
				title,
				price,
			});
			return res.data.data;
		},
	});

	const usePostRefundMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.post<PostRefundResponseType>(`${API_USER_URL}/refund/${id}`);
			return res.data;
		},
	});

	const useGetAllProductsQuery = () => {
		return useQuery({
			queryKey: ["stripe-payment-products"],
			queryFn: async () => {
				const res = await apiClient.get<GetAllProductsResponseType>(`${API_USER_URL}/product`);
				return res.data.data;
			},
		});
	};

	const useGetAllOrdersQuery = () => {
		return useQuery({
			queryKey: ["stripe-payment-orders"],
			queryFn: async () => {
				const res = await apiClient.get<GetAllOrdersResponseType>(`${API_USER_URL}/past-orders`);
				return res.data.data;
			},
		});
	};

	// ---------------------
	// Stripe Coupon api's
	// ---------------------
	const usePostCouponMutation = useMutation({
		mutationFn: async (coupon: PostCouponType) => {
			const res = await apiClient.post<PostCouponResponseType>(`${API_ADMIN_URL}/coupon`, coupon);
			return res.data.data;
		},
	});

	const useGetAllCouponsQuery = ({ limit, startingAfter, endingBefore, page }: GetAllCouponsType) => {
		return useQuery({
			queryKey: ["stripe-payment-coupons", limit, page],
			queryFn: async () => {
				let url = `${API_ADMIN_URL}/coupon?limit=${limit}`;
				if (startingAfter) {
					url += `&starting_after=${startingAfter}`;
				} else if (endingBefore) {
					url += `&ending_before=${endingBefore}`;
				}
				const res = await apiClient.get<GetAllCouponsResponseType>(url);
				return res.data.data;
			},
		});
	};

	const useDeleteCouponMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.delete<DeleteCouponResponseType>(`${API_ADMIN_URL}/coupon/${id}`);
			return res.data.data;
		},
	});

	// ---------------------------
	// Stripe Prmotion code api's
	// ---------------------------
	const usePostPromotionCodeMutation = useMutation({
		mutationFn: async (promotionCode: PostPromotionCodeSchemaType) => {
			const res = await apiClient.post<PostPromotionCodeResponseType>(`${API_ADMIN_URL}/promotion-code`, promotionCode);
			return res.data.data;
		},
	});

	const useGetAllPromotionCodesQuery = ({
		couponId,
		limit,
		startingAfter,
		endingBefore,
		page,
	}: GetAllPromotionCodesType) => {
		return useQuery({
			queryKey: ["stripe-payment-promotion-codes", couponId, limit, page],
			queryFn: async () => {
				let url = `${API_ADMIN_URL}/promotion-code/${couponId}?limit=${limit}`;
				if (startingAfter) {
					url += `&starting_after=${startingAfter}`;
				} else if (endingBefore) {
					url += `&ending_before=${endingBefore}`;
				}
				const res = await apiClient.get<GetAllPromotionCodesResponseType>(url);
				return res.data.data;
			},
		});
	};

	// ---------------------------
	// Stripe Checkout code api's
	// ---------------------------
	const usePostCheckoutSessionMutation = useMutation({
		mutationFn: async (productId: string) => {
			const res = await apiClient.post<PostCheckoutSessionResponseType>(`${API_USER_URL}/create-checkout-session`, {
				productId,
			});
			return res.data.data;
		},
	});

	const useGetSessionStatusQuery = (sessionId: string | null) => {
		return useQuery({
			queryKey: ["stripe-payment-session-status"],
			queryFn: async () => {
				const res = await apiClient.get<GetSessionStatusResponseType>(
					`${API_USER_URL}/session-status?sessionId=${sessionId as string}`
				);
				return res.data.data;
			},
			enabled: !!sessionId, // only run if sessionId is given
		});
	};

	return {
		usePostProductMutation,
		usePostRefundMutation,
		useGetAllProductsQuery,
		useGetAllOrdersQuery,
		usePostCouponMutation,
		useGetAllCouponsQuery,
		useDeleteCouponMutation,
		usePostPromotionCodeMutation,
		useGetAllPromotionCodesQuery,
		usePostCheckoutSessionMutation,
		useGetSessionStatusQuery,
	};
};
