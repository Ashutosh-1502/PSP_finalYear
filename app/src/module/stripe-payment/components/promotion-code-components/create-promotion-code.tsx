"use client";

import { useRouter } from "next/navigation";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import {
	type CreatePromotionCodeType,
	postPromotionCodeSchema,
	type PostPromotionCodeSchemaType,
	type PostPromotionCodeType,
} from "@/module/stripe-payment/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function CreatePromotionCode({ couponId }: CreatePromotionCodeType) {
	const router = useRouter();
	const { usePostPromotionCodeMutation } = useStripePaymentAPI();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PostPromotionCodeType>({
		resolver: zodResolver(postPromotionCodeSchema),
	});

	const handleCreate = (data: PostPromotionCodeType) => {
		usePostPromotionCodeMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Promotion code created successfully", { duration: 2000 });
				reset();
			},
			onError: () => {
				toast.error("Promotion code creation failed", { duration: 2000 });
			},
		});
	};

	const onSubmit: SubmitHandler<PostPromotionCodeSchemaType> = (data) => {
		handleCreate({ coupon: couponId, ...data });
	};

	return (
		<div>
			<h1>Create Coupon</h1>
			<div className="m-auto flex w-[50%] flex-col gap-5">
				<form
					onSubmit={(event) => void handleSubmit(onSubmit)(event)}
					onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
				>
					{/* Code Field */}
					<div className="relative">
						<Label htmlFor="code" className="mb-1 mt-3 text-sm font-bold">
							Code
						</Label>
						<Input type="text" {...register("code")} id="code" className={errors.code ? "border-red pr-10" : "pr-10"} />
						{errors.code && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="absolute right-1 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.code.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{/* Max Redemptions Field */}
					<div className="relative">
						<Label htmlFor="max_redemptions" className="mb-1 mt-3 text-sm font-bold">
							Max Redemptions <OptionalField />
						</Label>
						<Input type="number" {...register("max_redemptions")} id="max_redemptions" />
						{errors.max_redemptions && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.max_redemptions.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{/* Expires At Field */}
					<div className="relative">
						<Label htmlFor="expires_at" className="mb-1 mt-3 text-sm font-bold">
							Expires At <OptionalField />
						</Label>
						<Input type="date" {...register("expires_at")} id="expires_at" />
						{errors.expires_at && <p>{errors.expires_at.message}</p>}
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

export function OptionalField() {
	return <span className="text-xs font-light">(optional)</span>;
}
