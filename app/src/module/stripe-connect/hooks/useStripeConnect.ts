import { apiClient } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
	PostAccountResponseType,
	PostAccountSessionResponseType,
	PostAccountSessionType,
	PostCustomerIdResponseType,
	PostPaymentIntentResponseType,
	PostRefundResponseType,
	GetAllOrdersResponseType,
	GetAllProductsResponseType,
	PostDashboardLinkResponseType,
	PostProductType,
	PostProductResponseType,
	GetCustomerResponseType,
	GetVendorResponseType,
	GetAllTransferredTransactionsType,
	GetAllTransferredTransactionsResponseType,
	GetAllTransactionsResponseType,
	GetAllTransactionsType,
	GetEarningDetailsResponseType,
	GetMonthlyEarningsResponseType,
	PostEarlyTransferResponseType,
	GetVendorsResponseType,
	PostVendorType,
	PostVendorResponseType,
	PaginatedVendorSearchQuery,
} from "@/module/stripe-connect/types";

const API_SUPER_ADMIN_URL = "/super-admin/stripe";
const API_ADMIN_URL = "/admin/stripe-connect";
const API_USER_URL = "/stripe-connect";

export const useStripeConnectAPI = () => {
	// ---------------------------
	// Part of `Super Admin` flow
	// ---------------------------
	const useUpdateVendorMutation = useMutation({
		mutationFn: async ({ stripeAccountId, tier }: PostVendorType) => {
			const res = await apiClient.put<PostVendorResponseType>(`${API_SUPER_ADMIN_URL}/vendor/${stripeAccountId}`, {
				tier,
			});
			return res.data;
		},
	});

	const useGetAllVendorsQuery = (query: PaginatedVendorSearchQuery) => {
		return useQuery({
			queryKey: ["vendors", "super-admin-flow", query?.searchValue, query?.page, query?.pageSize],
			queryFn: async () => {
				const res = await apiClient.get<GetVendorsResponseType>(`${API_SUPER_ADMIN_URL}/vendors`, { params: query });
				return res.data.data;
			},
		});
	};

	// ---------------------
	// Part of `Admin` flow
	// ---------------------
	const usePostAccountMutation = useMutation({
		mutationFn: async () => {
			const res = await apiClient.post<PostAccountResponseType>(`${API_ADMIN_URL}/account`);
			return res.data;
		},
	});

	const usePostAccountSessionMutation = useMutation({
		mutationFn: async ({ accountId }: PostAccountSessionType) => {
			const res = await apiClient.post<PostAccountSessionResponseType>(`${API_ADMIN_URL}/account-session`, {
				accountId,
			});
			return res.data;
		},
	});

	const usePostDashboardLinkMutation = useMutation({
		mutationFn: async () => {
			const res = await apiClient.post<PostDashboardLinkResponseType>(`${API_ADMIN_URL}/express-dashboard`);
			return res.data.data;
		},
	});

	const usePostProductMutation = useMutation({
		mutationFn: async ({ title, price }: PostProductType) => {
			const res = await apiClient.post<PostProductResponseType>(`${API_ADMIN_URL}/product`, {
				title,
				price,
			});
			return res.data.data;
		},
	});

	const usePostEarlyTransferMutation = useMutation({
		mutationFn: async () => {
			const res = await apiClient.post<PostEarlyTransferResponseType>(`${API_ADMIN_URL}/early-transfer`);
			return res.data.data;
		},
	});

	const useGetAllTransactionsQuery = ({ page, pageSize }: GetAllTransactionsType) => {
		return useQuery({
			queryKey: ["all-transactions", page, pageSize],
			queryFn: async () => {
				const res = await apiClient.get<GetAllTransactionsResponseType>(`${API_ADMIN_URL}/all-transactions`, {
					params: { page, pageSize },
				});
				return res.data.data;
			},
		});
	};

	const useGetAllTransferredTransactionsQuery = ({
		limit,
		startingAfter,
		endingBefore,
		page,
	}: GetAllTransferredTransactionsType) => {
		return useQuery({
			queryKey: ["transferred-transactions", limit, page],
			queryFn: async () => {
				let url = `${API_ADMIN_URL}/transferred-transactions?limit=${limit}`;
				if (startingAfter) {
					url += `&starting_after=${startingAfter}`;
				} else if (endingBefore) {
					url += `&ending_before=${endingBefore}`;
				}
				const res = await apiClient.get<GetAllTransferredTransactionsResponseType>(url);
				return res.data.data;
			},
		});
	};

	const useGetEarningDetailsQuery = () => {
		return useQuery({
			queryKey: ["earning-details"],
			queryFn: async () => {
				const res = await apiClient.get<GetEarningDetailsResponseType>(`${API_ADMIN_URL}/earning-details`);
				return res.data.data;
			},
		});
	};

	const useGetVendorQuery = () => {
		return useQuery({
			queryKey: ["vendor"],
			queryFn: async () => {
				const res = await apiClient.get<GetVendorResponseType>(`${API_ADMIN_URL}/vendor-details`);
				return res.data.data;
			},
		});
	};

	const useGetMonthlyEarningsQuery = () => {
		return useQuery({
			queryKey: ["monthly-earnings"],
			queryFn: async () => {
				const res = await apiClient.get<GetMonthlyEarningsResponseType>(`${API_ADMIN_URL}/monthly-earnings`);
				return res.data.data;
			},
		});
	};

	// --------------------
	// Part of `User` flow
	// --------------------
	const usePostPaymentIntentMutation = useMutation({
		mutationFn: async (productId: string) => {
			const res = await apiClient.post<PostPaymentIntentResponseType>(`${API_USER_URL}/create-payment-intent`, {
				productId,
			});
			return res.data.data;
		},
	});

	const usePostCustomerIdMutation = useMutation({
		mutationFn: async () => {
			const res = await apiClient.post<PostCustomerIdResponseType>(`${API_USER_URL}/customer`);
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
			queryKey: ["stripe-connect-products"],
			queryFn: async () => {
				const res = await apiClient.get<GetAllProductsResponseType>(`${API_USER_URL}/product`);
				return res.data.data;
			},
		});
	};

	const useGetAllOrdersQuery = () => {
		return useQuery({
			queryKey: ["stripe-connect-orders"],
			queryFn: async () => {
				const res = await apiClient.get<GetAllOrdersResponseType>(`${API_USER_URL}/past-orders`);
				return res.data.data;
			},
		});
	};

	const useGetCustomerQuery = () => {
		return useQuery({
			queryKey: ["stripe-connect-customer"],
			queryFn: async () => {
				const res = await apiClient.get<GetCustomerResponseType>(`${API_USER_URL}/customer`);
				return res.data.data;
			},
		});
	};

	return {
		useUpdateVendorMutation,
		usePostAccountMutation,
		usePostAccountSessionMutation,
		usePostDashboardLinkMutation,
		usePostPaymentIntentMutation,
		usePostCustomerIdMutation,
		usePostRefundMutation,
		usePostProductMutation,
		usePostEarlyTransferMutation,
		useGetAllProductsQuery,
		useGetAllOrdersQuery,
		useGetAllTransactionsQuery,
		useGetAllTransferredTransactionsQuery,
		useGetEarningDetailsQuery,
		useGetVendorQuery,
		useGetCustomerQuery,
		useGetMonthlyEarningsQuery,
		useGetAllVendorsQuery,
	};
};
