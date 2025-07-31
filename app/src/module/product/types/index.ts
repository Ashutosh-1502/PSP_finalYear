import { z } from "zod";
import { type ProductFormType } from "@/module/product/utils/form-utils";

// ------------------
// react-query types
// ------------------
export type GetAllProductResponseType = {
	success: boolean;
	message: string;
	data: [{ items: ProductResponseType[]; total: number; page: number; pageSize: number }];
	errors: object;
};

export type GetOneProductResponseType = {
	success: boolean;
	message: string;
	data: ProductResponseType;
	errors: object;
};
export type ProductResponseType = {
	_id: string;
	title: string;
	description: string;
	price: number;
	costPrice: number;
	retailPrice: number;
	salePrice: number;
	companyRef: string;
};

// ----------------
// component types
// ----------------
export type CreateEditProductType = {
	id?: string;
	product?: ProductFormType;
};

export type DeleteProductAlertType = {
	onDeleteProduct: () => void;
};

export function defaultValues(product?: CreateProductInput) {
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
	description: z.string().optional(),
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

export type CreateProductInput = z.infer<typeof productFormSchema>;
