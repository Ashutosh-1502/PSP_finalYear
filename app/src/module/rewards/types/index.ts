import { type ReactNode } from "react";
import type { RewardFormType } from "@/module/rewards/utils/form-utils";
import { z } from "zod";

// ------------------
// react-query types
// ------------------

export enum ACTION {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	DELETED = "DELETED",
}

export type GetAllRewardsResponseType = {
	success: boolean;
	message: string;
	data: [{ items: RewardResponseType[]; total: number; page: number; pageSize: number }];
	error: object;
};

export type GetOneRewardResponseType = {
	success: boolean;
	message: string;
	data: RewardResponseType;
	errors: object;
};

export type RewardResponseType = {
	_id: string;
	title: string;
	subTitle: string;
	description: string;
	points: string;
	isSpecialReward: boolean;
	colorHash: string[];
	sequence: number;
	status: string;
	createdAt: string;
};

// ----------------
// component types
// ----------------

export type CreateEditRewardType = {
	id?: string;
	reward?: RewardFormType;
	children?: ReactNode;
};

export interface UserDetailsProps {
	reward: RewardResponseType;
	onConfirm: (status: ACTION, user: RewardResponseType) => void;
}

export interface RewardDisableEnableProps {
	title: string;
	operation: ACTION;
	onConfirm: () => void;
	children: ReactNode;
}

export interface RewardsDeleteProps {
	title: string;
	onConfirm: () => void;
}

export type RewardDialogProps = {
	id?: string;
	isSuccessOpen: boolean;
	setIsSuccessOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children?: ReactNode;
};

export type CreateEditProps = {
	type: string;
};

export function defaultValues(reward?: CreateRewardInput) {
	return {
		title: reward?.title ?? "",
		subTitle: reward?.subTitle ?? "",
		description: reward?.description ?? "",
		points: reward?.points ?? "",
		colorHash: reward?.colorHash ?? "",
	};
}

export const rewardFormSchema = z.object({
	_id: z.string().optional(),
	title: z.string().min(1, { message: "This field is required" }),
	subTitle: z.string().min(1, { message: "This field is required" }),
	description: z.string().min(1, { message: "This field is required" }),
	points: z
		.number()
		.min(0, { message: "This field is required" })
		.or(z.string().min(1, { message: "This field is required" })),
	colorHash: z.string().min(3, { message: "This field is required" }),
});

export type CreateRewardInput = z.infer<typeof rewardFormSchema>;
