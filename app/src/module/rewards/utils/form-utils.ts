import { z } from "zod";

export function defaultValues(reward?: RewardFormType) {
	return {
		title: reward?.title ?? "",
		subTitle: reward?.subTitle ?? "",
		description: reward?.description ?? "",
		points: reward?.points ?? "",
		colorHash: reward?.colorHash ?? [],
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
	colorHash: z.array(
		z
			.string()
			.min(4)
			.regex(/^#([0-9A-Fa-f]{6})$/, { message: "Invalid hex code" })
	),
	companyRef: z.string().optional().nullable(),
});

export function getDate(isoString: string): string {
	const date = new Date(isoString);
	return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}

export type RewardFormType = z.infer<typeof rewardFormSchema>;
