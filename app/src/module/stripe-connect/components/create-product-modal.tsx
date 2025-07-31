"use client";

import { type CreateProductType, productFormSchema, type CreateProductModalType } from "@/module/stripe-connect/types";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CreateProductModal({ stripeAccountId }: CreateProductModalType) {
	const [open, setOpen] = useState(false);
	const { usePostProductMutation } = useStripeConnectAPI();

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
					setOpen(false);
				},
				onError: () => {
					toast.error(`Product creation failed!`, {
						duration: 2000,
					});
				},
			}
		);
		reset();
	};

	const onSubmit: SubmitHandler<CreateProductType> = (data) => {
		handleCreate({ title: data.title, price: data.price });
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button disabled={!stripeAccountId}>Create Product</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Product</DialogTitle>
					</DialogHeader>
					<form>
						<Label>Title</Label>
						<Input type="text" {...register("title")} placeholder="eg: T-shirt" />
						{errors.title && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="absolute right-2 top-2.5">
											<FaInfoCircle className="text-red-500" />
										</div>
									</TooltipTrigger>
									<TooltipContent>{errors.title.message}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						<Label>Price</Label>
						<Input type="number" {...register("price")} placeholder="eg: 100" />
						{errors.title && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="absolute right-2 top-2.5">
											<FaInfoCircle className="text-red-500" />
										</div>
									</TooltipTrigger>
									<TooltipContent>{errors.title.message}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</form>

					<DialogFooter className="gap-2">
						<Button onClick={() => setOpen(false)} variant="outline" className="w-1/2">
							Cancel
						</Button>
						<Button onClick={(event) => void handleSubmit(onSubmit)(event)} className="w-1/2">
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
