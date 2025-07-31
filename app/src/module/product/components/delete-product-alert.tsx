import { useState } from "react";
import Image from "next/image";
import type { DeleteProductAlertType } from "@/module/product/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteProductAlert({ onDeleteProduct }: DeleteProductAlertType) {
	const [open, setOpen] = useState(false);

	return (
		<TooltipProvider>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<Tooltip>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button variant="outline" className="border-none p-2 text-white">
								<Image src="/assets/svg/delete.svg" alt="delete" width={20} height={20} />
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete product</p>
					</TooltipContent>
				</Tooltip>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Product</AlertDialogTitle>

						<AlertDialogDescription>Are you sure you want to delete this product?</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onDeleteProduct();
							}}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</TooltipProvider>
	);
}
