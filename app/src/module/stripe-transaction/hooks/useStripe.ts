import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetAllTransactionsResponseType, GetAllTransactionsType } from "@/module/stripe-transaction/types";

const API_SUPER_ADMIN_URL = "/super-admin/stripe";

export const useStripeAPI = () => {
	const useGetAllTransactionsQuery = ({ limit, startingAfter, endingBefore, page }: GetAllTransactionsType) => {
		return useQuery({
			queryKey: ["stripe-transactions", limit, page],
			queryFn: async () => {
				let url = `${API_SUPER_ADMIN_URL}/stripe-transactions?limit=${limit}`;
				if (startingAfter) {
					url += `&starting_after=${startingAfter}`;
				} else if (endingBefore) {
					url += `&ending_before=${endingBefore}`;
				}
				const res = await apiClient.get<GetAllTransactionsResponseType>(url);
				return res.data.data;
			},
		});
	};

	return {
		useGetAllTransactionsQuery,
	};
};
