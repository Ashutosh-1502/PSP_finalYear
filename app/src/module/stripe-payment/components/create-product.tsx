"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { productFormSchema, type CreateProductType } from "@/module/stripe-payment/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function CreateProduct() {
	const router = useRouter();
	const { usePostProductMutation } = useStripePaymentAPI();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProductType>({
		resolver: zodResolver(productFormSchema),
	});

	const handleCreate = ({ title, price }: CreateProductType) => {
		usePostProductMutation.mutate(
			{ title, price },
			{
				onSuccess: () => {
					toast.success(<p>Product created successfully!</p>, {
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

	const onSubmit: SubmitHandler<CreateProductType> = (data) => {
		handleCreate({ title: data.title, price: data.price });
	};

	return (
		<div>
			<h1>Create Product</h1>
			<div className="m-auto flex w-[50%] flex-col gap-5">
				<form
					onSubmit={(event) => void handleSubmit(onSubmit)(event)}
					onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
				>
					<div className="relative">
						<Label htmlFor="fieldLabel" className="mb-1 mt-3 text-sm font-bold">
							Title
						</Label>
						<Input
							type="text"
							id="title"
							{...register("title")}
							className={errors.title ? "border-red pr-10" : "pr-10"}
						/>
						{errors.title && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle />
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
						<Label htmlFor="fieldLabel" className="mb-1 mt-3 text-sm font-bold">
							Price
						</Label>
						<Input
							type="number"
							id="price"
							{...register("price")}
							className={errors.price ? "border-red pr-10" : "pr-10"}
						/>
						{errors.price && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.price.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<div className="mt-3 flex justify-end gap-2">
						<Button onClick={() => router.back()} variant="outline" type="button">
							<IoMdArrowRoundBack className="mr-2" />
							Back
						</Button>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
