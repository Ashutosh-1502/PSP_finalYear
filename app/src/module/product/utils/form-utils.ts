import { z } from "zod";

export function defaultValues(product?: ProductFormType) {
	return {
		title: product?.title ?? "",
		description: product?.description ?? "",
		price: product?.price ?? "",
		costPrice: product?.costPrice ?? "",
		retailPrice: product?.retailPrice ?? "",
		salePrice: product?.salePrice ?? "",
	};
}

export const productFormSchema = z.object({
	_id: z.string().optional(),
	title: z.string().min(1, { message: "This field is required" }),
	description: z.string().min(1, { message: "This field is required" }),
	productImages: z.array(z.string().optional()).optional(),
	price: z
		.number()
		.min(0, { message: "This field is required" })
		.or(z.string().min(1, { message: "This field is required" })),
	costPrice: z.number().optional().or(z.string().optional()),
	retailPrice: z.number().optional().or(z.string().optional()),
	salePrice: z.number().optional().or(z.string().optional()),
	companyRef: z.string().optional().nullable(),
});

export type ProductFormType = z.infer<typeof productFormSchema>;
