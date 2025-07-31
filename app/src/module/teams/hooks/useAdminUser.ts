import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { UserDataType } from "@/module/teams/types/index";

export const useAdminUserAPI = () => {
	const useGetOneUserQuery = (userId: string) => {
		return useQuery({
			queryKey: ["user-details", userId],
			queryFn: async () => {
				const response = await apiClient.get<UserDataType>(`/admin/user/${userId}`);
				return response.data;
			},
			enabled: !!userId,
		});
	};
	return { useGetOneUserQuery };
};
