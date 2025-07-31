"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogFooter,
	DialogClose,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CreateEditRewardType } from "@/module/rewards/types/index";
import { type RewardFormType, defaultValues, rewardFormSchema } from "@/module/rewards/utils/form-utils";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRewardAPI } from "@/module/rewards/hooks/useRewards";
import Cookies from "js-cookie";
import { COOKIES } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaInfoCircle } from "react-icons/fa";
import { X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import toast from "react-hot-toast";
import RewardDialog from "@/module/rewards/components/create-edit-reward-alert";

export default function CreateEditReward({ id, reward, children }: CreateEditRewardType) {
	const [selectedColors, setSelectedColors] = useState<string[]>(() => {
		return reward?.colorHash && Array.isArray(reward.colorHash) ? reward.colorHash : [];
	});

	const [tempColor, setTempColor] = useState<string>("#ffffff");
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);

	const actionText = id ? "Edit the Reward" : "Create a new Reward";
	const { useUpdateRewardMutation, usePostRewardMutation } = useRewardAPI();
	const companyRef = Cookies.get(COOKIES.COMPANY_REF);

	const addColor = (color: string) => {
		if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
			toast.error("Invalid hex code");
			return;
		}
		if (selectedColors.includes(color)) {
			toast.error("Color already added");
			return;
		}
		setSelectedColors((prev) => [...prev, color]);
	};

	const removeColor = (index: number) => {
		setSelectedColors((prev) => prev.filter((_, i) => i !== index));
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RewardFormType>({
		defaultValues: defaultValues(reward),
		resolver: zodResolver(rewardFormSchema),
	});

	const handleCreate = (data: RewardFormType) => {
		usePostRewardMutation.mutate(
			{ ...data, companyRef },
			{
				onSuccess: () => {
					toast.success(`Reward created successfully!`, {
						duration: 2000,
					});
					reset();
					setSelectedColors([]);
					setIsSuccessOpen(true);
				},
				onError: () => {
					toast.error(`Reward creation failed!`, {
						duration: 2000,
					});
					setIsSuccessOpen(false);
				},
			}
		);
	};

	const handleUpdate = (id: string, data: RewardFormType) => {
		useUpdateRewardMutation.mutate(
			{ id, data: { ...data, companyRef } },
			{
				onSuccess: () => {
					toast.success(`Reward updated successfully!`, {
						duration: 2000,
					});
					setIsSuccessOpen(true);
				},
				onError: () => {
					toast.error(`Reward updation failed!`, {
						duration: 2000,
					});
					setIsSuccessOpen(false);
				},
			}
		);
	};

	const onSubmit: SubmitHandler<RewardFormType> = (data) => {
		const finalData = {
			...data,
			colorHash: selectedColors,
		};

		if (id) {
			handleUpdate(id, finalData);
		} else {
			handleCreate(finalData);
		}
	};

	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl">{actionText}</DialogTitle>
				</DialogHeader>
				{/* form controls */}
				<div>
					<form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="flex flex-col space-y-5">
						<div className="relative flex flex-col space-y-2">
							<Label className="text-sm text-gray-500">Reward Name</Label>
							<Input
								type="text"
								{...register("title")}
								className={errors.title ? "border-red" : ""}
								placeholder="Name Here"
							/>
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
						<div className="relative flex flex-col space-y-2">
							<Label className="text-sm text-gray-500">Subtitle</Label>
							<Input
								type="text"
								{...register("subTitle")}
								className={errors.title ? "border-red" : ""}
								placeholder="Subtitle Here"
							/>
							{errors.subTitle && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{errors.subTitle.message}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
						<div className="relative flex flex-col space-y-2">
							<Label htmlFor="title" className="text-sm text-gray-500">
								Description
							</Label>
							<Textarea
								{...register("description")}
								className={errors.description ? "border-red" : ""}
								placeholder="Description Here"
							/>
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
						<div className="relative flex flex-col space-y-2">
							<Label htmlFor="title" className="text-sm text-gray-500">
								Required Points
							</Label>
							<Input
								type="number"
								{...register("points")}
								className={errors.points ? "border-red" : ""}
								placeholder="Enter points"
							/>
							{errors.points && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-md  absolute right-2 top-10 -translate-y-1/2 text-red">
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{errors.points.message}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
						<div className="relative flex flex-col space-y-2">
							<div className="flex justify-between">
								<Label htmlFor="colorHash" className="text-sm text-gray-500">
									Hex Code for Background Color
								</Label>

								<Popover>
									<PopoverTrigger asChild>
										<span className="text-blue-500 cursor-pointer text-sm underline">Preview</span>
									</PopoverTrigger>
									<PopoverContent side="right" align="start" className="h-48 w-72 p-2">
										{selectedColors.length > 0 ? (
											<div
												className="relative flex h-40 w-full items-center justify-center rounded-xl border shadow sm:h-44"
												style={{
													background: `linear-gradient(-45deg, ${selectedColors.join(", ")})`,
												}}
											>
												<p className="z-10 text-lg font-semibold text-white drop-shadow-md">Selected Colors Preview</p>
											</div>
										) : (
											<p className="text-sm text-gray-500">No colors selected</p>
										)}
									</PopoverContent>
								</Popover>
							</div>

							<div className="relative w-full">
								{/* Color Picker Popover Button */}
								<Popover>
									<PopoverTrigger asChild>
										<button
											type="button"
											className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-lg border"
											style={{ backgroundColor: tempColor }}
										/>
									</PopoverTrigger>
									<PopoverContent className="w-fit p-2">
										<HexColorPicker color={tempColor} onChange={setTempColor} />
										<Button type="button" className="mt-2 w-full" onClick={() => addColor(tempColor)}>
											Add Color
										</Button>
									</PopoverContent>
								</Popover>

								{/* Input with left padding to make space for the color circle */}
								<Input
									type="text"
									value={tempColor}
									onChange={(e) => setTempColor(e.target.value)}
									className={`pl-10 ${errors.colorHash ? "border-red-500 border" : ""}`}
									placeholder="#ffffff"
								/>
							</div>

							{/* Error Tooltip */}
							{selectedColors.length < 0 && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-md absolute right-2 top-10 -translate-y-1/2 text-red">
												<FaInfoCircle className="text-red" />
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>At least one color Hash is Required</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}

							{/* Selected Colors */}
							<div className="flex min-h-[48px] w-full flex-wrap gap-2 rounded-md bg-gray-100 px-3 py-2">
								{selectedColors.length === 0 ? (
									<p className="text-sm text-gray-500">No Hex color added</p>
								) : (
									selectedColors.map((color, index) => (
										<div
											key={index}
											className="flex items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-sm"
										>
											<div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />
											<span className="text-xs">{color}</span>
											<button
												type="button"
												className="hover:text-red-500 ml-1 text-gray-500"
												onClick={() => removeColor(index)}
											>
												<X size={12} />
											</button>
										</div>
									))
								)}
							</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" type="button">
									Cancel
								</Button>
							</DialogClose>

							<RewardDialog id={reward?._id} isSuccessOpen={isSuccessOpen} setIsSuccessOpen={setIsSuccessOpen}>
								<Button variant="outline" type="submit">
									Create
								</Button>
							</RewardDialog>
						</DialogFooter>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
