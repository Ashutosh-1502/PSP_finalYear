"use client";

import { type CreateEditProductType } from "@/module/product/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { type ProductFormType, defaultValues, productFormSchema } from "@/module/product/utils/form-utils";
import { useProductAPI } from "@/module/product/hooks/useProducts";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { COOKIES } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateEditProduct({ id, product }: CreateEditProductType) {
	const router = useRouter();
	const { usePostProductMutation, useUpdateProductMutation } = useProductAPI();
	const companyRef = Cookies.get(COOKIES.COMPANY_REF);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductFormType>({
		defaultValues: defaultValues(product),
		resolver: zodResolver(productFormSchema),
	});

	const handleCreate = (data: ProductFormType) => {
		usePostProductMutation.mutate(
			{ ...data, companyRef },
			{
				onSuccess: () => {
					toast.success(`Product created successfully!`, {
						duration: 2000,
					});
					reset();
				},
				onError: () => {
					toast.error(`Product creation failed!`, {
						duration: 2000,
					});
				},
			}
		);
	};

	const handleUpdate = (id: string, data: ProductFormType) => {
		useUpdateProductMutation.mutate(
			{ id, data: { ...data, companyRef } },
			{
				onSuccess: () => {
					toast.success(`Product updated successfully!`, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(`Product updation failed!`, {
						duration: 2000,
					});
				},
			}
		);
	};

	const onSubmit: SubmitHandler<ProductFormType> = (data) => {
		if (id) {
			handleUpdate(id, data);
			return;
		}
		handleCreate(data);
	};

	return (
		<div>
			<h1>{id ? "Edit Product" : "Create Product"}</h1>
			<div className="m-auto flex w-[50%] flex-col gap-5">
				<form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
					<div className="relative">
						<Label className="mb-5 mt-3 text-sm font-bold">Title</Label>
						<Input type="text" {...register("title")} className={errors.title ? "border-red" : ""} />
						{errors.title && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.title.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="title" className="mb-1 mt-3 text-sm font-bold">
							Description
						</Label>
						<Textarea {...register("description")} className={errors.description ? "border-red" : ""} />
						{errors.description && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.description.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="title" className="mb-1 mt-3 text-sm font-bold">
							Price
						</Label>
						<Input type="number" {...register("price")} className={errors.price ? "border-red" : ""} />
						{errors.price && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.price.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="title" className="mb-1 mt-3 text-sm font-bold">
							Cost Price
						</Label>
						<Input type="number" {...register("costPrice")} className={errors.costPrice ? "border-red" : ""} />
						{errors.costPrice && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.costPrice.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="title" className="mb-1 mt-3 text-sm font-bold">
							Retail Price
						</Label>
						<Input type="number" {...register("retailPrice")} className={errors.retailPrice ? "border-red" : ""} />
						{errors.retailPrice && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.retailPrice.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="relative">
						<Label htmlFor="title" className="mb-1 mt-3 text-sm font-bold">
							Sale Price
						</Label>
						<Input type="number" {...register("salePrice")} className={errors.salePrice ? "border-red" : ""} />
						{errors.salePrice && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle className="text-red" />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.salePrice.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="mt-3 flex justify-end gap-2">
						<Button onClick={() => router.back()} variant="outline" type="button">
							<IoMdArrowRoundBack /> Back
						</Button>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
