import { apiClient } from "@/lib/api";
import type { PaginatedSearchQuery } from "@/types";
import type { GetAllUserResponseType, GetOneUserResponseType } from "@/module/manage-users/types/index";
import { type ACTION } from "@/module/manage-users/types/index";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_ADMIN_URL = "/admin/user";

export const useManageUserAPI = () => {
	const useGetAllUsersQuery = (query: PaginatedSearchQuery, onBlockUser?: (id: string, action: ACTION) => void) => {
		return useQuery({
			queryKey: ["users", query?.searchValue, query?.page, query?.pageSize, query?.sortBy, onBlockUser],
			queryFn: async () => {
				const res = await apiClient.get<GetAllUserResponseType>(`${API_ADMIN_URL}`, { params: query });
				return res.data.data;
			},
		});
	};

	const useGetOneUserQuery = (id: string) => {
		return useQuery({
			queryKey: ["users", id],
			queryFn: async () => {
				const res = await apiClient.get<GetOneUserResponseType>(`${API_ADMIN_URL}/${id}`);
				return res.data.data;
			},
			enabled: !!id,
		});
	};

	const useBlockUserMutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; companyRef: string; status: ACTION }) => {
			try {
				const res = await apiClient.put(`${API_ADMIN_URL}/status/${id}`, { status });
				return res;
			} catch (err) {
				console.log(err);
			}
		},
	});

	return {
		useGetAllUsersQuery,
		useGetOneUserQuery,
		useBlockUserMutation,
	};
};
