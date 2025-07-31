import { apiClient } from "@/lib/api";
import type { PaginatedSearchQuery } from "@/types";
import type { GetAllRewardsResponseType, GetOneRewardResponseType } from "@/module/rewards/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type RewardFormType } from "@/module/rewards/utils/form-utils";
import { type ACTION } from "@/module/rewards/types/index";

const API_ADMIN_URL = "/admin/rewards";

export const useRewardAPI = () => {
	const queryClient = useQueryClient();
	const invalidateRewards = async () => {
		await queryClient.invalidateQueries({ queryKey: ["rewards"] });
	};
	const usePostRewardMutation = useMutation({
		mutationFn: async (data: RewardFormType) => {
			const res = await apiClient.post(`${API_ADMIN_URL}/create-reward`, data);
			return res;
		},
		onSuccess: invalidateRewards,
	});

	const useGetAllRewardsQuery = (
		query: PaginatedSearchQuery,
		onManageReward?: (id: string, action: ACTION) => void
	) => {
		return useQuery({
			queryKey: [
				"rewards",
				query?.searchValue,
				query?.page,
				query?.pageSize,
				query?.sortBy,
				query.companyRef,
				onManageReward,
			],
			queryFn: async () => {
				const res = await apiClient.get<GetAllRewardsResponseType>(`${API_ADMIN_URL}`, { params: query });
				return res.data.data;
			},
		});
	};

	const useGetOneRewardQuery = (id: string, companyRef: string) => {
		return useQuery({
			queryKey: ["rewards", id, companyRef],
			queryFn: async () => {
				const res = await apiClient.get<GetOneRewardResponseType>(`${API_ADMIN_URL}/${id}`, {
					params: { companyRef },
				});
				return res.data.data;
			},
			enabled: !!id && !!companyRef, // Only execute the query when id and companyRef are available
		});
	};

	const useManageRewardMutation = useMutation({
		mutationFn: async ({ id, operation }: { id: string; operation: ACTION }) => {
			const res = await apiClient.put(`${API_ADMIN_URL}/status/${id}`, { operation });
			return res;
		},
	});

	const useUpdateRewardMutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: RewardFormType }) => {
			const res = await apiClient.put(`${API_ADMIN_URL}/${id}`, data);
			return res;
		},
		onSuccess: invalidateRewards,
	});

	const useUpdateRewardSequenceMutation = useMutation({
		mutationFn: async ({ sourceIndex, destinationIndex }: { sourceIndex?: number; destinationIndex?: number }) => {
			const res = await apiClient.put(`${API_ADMIN_URL}/reorder`, { sourceIndex, destinationIndex });
			return res;
		},
		onSuccess: invalidateRewards,
	});

	return {
		useGetAllRewardsQuery,
		useGetOneRewardQuery,
		usePostRewardMutation,
		useUpdateRewardMutation,
		useManageRewardMutation,
		useUpdateRewardSequenceMutation,
	};
};
