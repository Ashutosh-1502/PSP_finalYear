import { apiUrl, apiClient } from "@/lib/api";
import type { AwsUrlResponse } from "@/types";
import type { AxiosResponse } from "axios";

const PATH = {
	getAwsUrl: `${apiUrl}aws/presigned-url`,
};
export const getSignedUrlS3Service = async (payload: { name: string; type: string }) => {
	try {
		const response: AxiosResponse<AwsUrlResponse> = await apiClient.post(PATH.getAwsUrl, {
			fileName: payload.name,
			fileType: payload.type,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
