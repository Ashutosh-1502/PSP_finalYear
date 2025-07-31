import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import Image from "next/image";
import type { DeleteCouponAlertType } from "@/module/stripe-payment/types";

export function DeleteCouponAlert({ id, onDeleteCoupon }: DeleteCouponAlertType) {
	const [open, setOpen] = useState(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button variant="outline" className="border-none p-0 text-white hover:text-white">
								<Image src="/assets/svg/delete.svg" alt="delete" width={20} height={20} />
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
					<TooltipContent side="top">Delete Coupon</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<AlertDialogContent >
				<AlertDialogHeader>Delete Product</AlertDialogHeader>
				<AlertDialogDescription>Are you sure you want to delete this coupon?</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onDeleteCoupon(id);
							setOpen(false);
						}}
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
