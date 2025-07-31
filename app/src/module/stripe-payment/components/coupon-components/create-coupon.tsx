"use client";

import { useRouter } from "next/navigation";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import {
	CURRENCY,
	DISCOUNT_TYPE,
	DURATION,
	postCouponSchema,
	type PostCouponType,
} from "@/module/stripe-payment/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateCoupon() {
	const router = useRouter();
	// used to dynamically load duration_in_months field when duration is set to `repeating`.
	const [duration, setDuration] = useState<DURATION | "">("");
	// used to dynamically load amount_off or percent_off field based on discount type.
	const [discountType, setDiscountType] = useState<DISCOUNT_TYPE.AMOUNT | DISCOUNT_TYPE.PERCENT | "">("");
	const [discountTypeError, setDiscountTypeError] = useState("");
	const { usePostCouponMutation } = useStripePaymentAPI();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		unregister,
		formState: { errors },
		setError,
	} = useForm<PostCouponType>({
		defaultValues: {
			currency: CURRENCY.USD,
		},
		resolver: zodResolver(postCouponSchema),
	});

	const handleCreate = (data: PostCouponType) => {
		usePostCouponMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Coupon created successfully", { duration: 2000 });
				reset();
				setDiscountType("");
				setDuration("");
			},
			onError: () => {
				toast.error("Coupon creation failed", { duration: 2000 });
			},
		});
	};

	const handleDiscountTypeChange = (value: DISCOUNT_TYPE.AMOUNT | DISCOUNT_TYPE.PERCENT | "") => {
		setDiscountType(value);
		setDiscountTypeError("");
	};

	const onSubmit: SubmitHandler<PostCouponType> = (data) => {
		// Custom validation for `discountType`
		if (!discountType) {
			setDiscountTypeError("Please select a discount type.");
			return;
		} else {
			setDiscountTypeError("");
		}

		if (duration === DURATION.REPEATING && !data.duration_in_months) {
			setError("duration_in_months", {
				type: "manual",
				message: "Duration in months is required.",
			});
			return;
		}

		if (discountType === DISCOUNT_TYPE.AMOUNT && !data.amount_off) {
			setError("amount_off", {
				type: "manual",
				message: "Amount Off is required.",
			});
			return;
		}

		if (discountType === DISCOUNT_TYPE.PERCENT && !data.percent_off) {
			setError("percent_off", {
				type: "manual",
				message: "Percent Off is required.",
			});
			return;
		}

		handleCreate(data);
	};

	useEffect(() => {
		if (discountType === DISCOUNT_TYPE.PERCENT) {
			// Following fields are not part fo the form when discount type is `percent`.
			unregister("amount_off");
			unregister("currency");
		} else if (discountType === DISCOUNT_TYPE.AMOUNT) {
			// Following fields are not part fo the form when discount type is `amount`.
			unregister("percent_off");
		}
	}, [discountType, unregister]);

	useEffect(() => {
		// Following fields are not part fo the form when duration value is `once` or `forever`.
		if (duration === DURATION.REPEATING) {
			register("duration_in_months");
		} else {
			unregister("duration_in_months");
		}
	}, [duration, register, unregister]);

	return (
		<div>
			<h1>Create Coupon</h1>
			<div className="m-auto flex w-[50%] flex-col gap-5">
				<form
					onSubmit={(event) => void handleSubmit(onSubmit)(event)}
					onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
				>
					{/* Name Field */}
					<div className="relative">
						<Label htmlFor="name" className="mb-1 mt-3 text-sm font-bold">
							Name
						</Label>
						<Input type="text" {...register("name")} id="name" className={errors.name ? "border-red" : ""} />
						{errors.name && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
											<FaInfoCircle />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>{errors.name.message}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{/* Duration Field */}
					<div className="relative">
						<Label htmlFor="duration" className="mb-1 mt-3 text-sm font-bold">
							Duration
						</Label>
						<Select
							value={watch("duration")}
							onValueChange={(value) => {
								setValue("duration", value as DURATION, { shouldValidate: true });
								setDuration(value as DURATION);
							}}
						>
							<SelectTrigger className={errors.duration ? "border-red " : ""}>
								<SelectValue placeholder="Select Duration" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={DURATION.FOREVER}>Forever</SelectItem>
								<SelectItem value={DURATION.ONCE}>Once</SelectItem>
								<SelectItem value={DURATION.REPEATING}>Repeating</SelectItem>
							</SelectContent>
						</Select>
						{errors.duration && <p className="text-red">{errors.duration.message}</p>}
					</div>

					{/* Duration in months Field */}
					{duration === DURATION.REPEATING && (
						<div className="relative">
							<Label htmlFor="duration_in_months" className="mb-1 mt-3 text-sm font-bold">
								Duration in months
							</Label>
							<Input
								type="number"
								{...register("duration_in_months")}
								id="duration_in_months"
								className={errors.duration_in_months ? "border-red" : ""}
							/>
							{errors.duration_in_months && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{errors.duration_in_months.message}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					)}

					{/* Discount Type Field - Not part of the form but used to dynamically load the amount_off or percent_off field */}
					<div>
						<Label htmlFor="discount_type" className="mb-1 mt-3 text-sm font-bold">
							Discount Type
						</Label>
						<Select
							value={discountType}
							onValueChange={(value) =>
								handleDiscountTypeChange(value as DISCOUNT_TYPE.AMOUNT | DISCOUNT_TYPE.PERCENT | "")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Discount Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={DISCOUNT_TYPE.AMOUNT}>Amount</SelectItem>
								<SelectItem value={DISCOUNT_TYPE.PERCENT}>Percent</SelectItem>
							</SelectContent>
						</Select>
						{discountTypeError && <p className="text-red">{discountTypeError}</p>}
					</div>

					{/* Percent Off Field - Dynamically loaded based on discountType */}
					{discountType === DISCOUNT_TYPE.PERCENT && (
						<div className="relative">
							<Label htmlFor="percent_off" className="mb-1 mt-3 text-sm font-bold">
								Percent Off
							</Label>
							<Input
								type="number"
								{...register("percent_off")}
								id="percent_off"
								className={errors.percent_off ? "border-red" : ""}
							/>
							{errors.percent_off && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{errors.percent_off.message}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					)}

					{/* Amount Off Field - Dynamically loaded based on discountType */}
					{discountType === DISCOUNT_TYPE.AMOUNT && (
						<>
							<div className="relative">
								<Label htmlFor="amount_off" className="mb-1 mt-3 text-sm font-bold">
									Amount Off
								</Label>
								<Input
									type="number"
									{...register("amount_off")}
									id="amount_off"
									className={errors.amount_off ? "border-red" : ""}
								/>
								{errors.amount_off && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
													<FaInfoCircle className="text-red" />
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<p>{errors.amount_off.message}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
						</>
					)}
					{/* Currency Field */}
					<div>
						<Label htmlFor="currency" className="mb-1 mt-3 text-sm font-bold">
							Currency
						</Label>
						<Select
							value={watch("currency")}
							onValueChange={(value) => {
								setValue("currency", value as CURRENCY, { shouldValidate: true });
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Currency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={CURRENCY.USD}>USD</SelectItem>
							</SelectContent>
						</Select>
						{errors.currency && <p>{errors.currency.message}</p>}
					</div>

					{/* Max Redemptions Field */}
					<div>
						<Label htmlFor="max_redemptions" className="mb-1 mt-3 text-sm font-bold">
							Max Redemptions <OptionalField />
						</Label>
						<>
							<Input type="number" {...register("max_redemptions")} id="max_redemptions" />
							{errors.max_redemptions && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span tabIndex={0}>
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{errors.max_redemptions.message}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</>
					</div>

					{/* Redeem By Field */}
					<div>
						<Label htmlFor="redeem_by" className="mb-1 mt-3 text-sm font-bold">
							Redeem By <OptionalField />
						</Label>
						<Input type="date" {...register("redeem_by")} id="redeem_by" />
						{errors.redeem_by && <p>{errors.redeem_by.message}</p>}
					</div>

					<div className="mt-3 flex justify-end gap-2">
						<Button onClick={() => router.back()} variant="outline" type="button">
							<IoMdArrowRoundBack />
							Back
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
