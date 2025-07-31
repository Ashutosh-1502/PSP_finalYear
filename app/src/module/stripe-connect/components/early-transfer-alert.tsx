"use client";

import { useRef, useState } from "react";
import { type EarlyTransferAlertType } from "@/module/stripe-connect/types";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function EarlyTransferAlert({
	vendorData,
	handleEarlyTransfer,
	transferInProgress,
	earningDetails,
}: EarlyTransferAlertType) {
	const [open, setOpen] = useState(false);
	const cancelRef = useRef<HTMLButtonElement>(null);
	const isDisabled = vendorData.amountOwedToPlatform > 0 || earningDetails?.totalPending == 0;
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button disabled={isDisabled} className="mt-2" variant="outline">
					{transferInProgress ? `Transferring...` : `Request Transfer`}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Early Transfer</AlertDialogTitle>

					<AlertDialogDescription>
						Are you sure you want to transfer the amount before lock-in period is over?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel ref={cancelRef} onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<Button
						onClick={() => {
							handleEarlyTransfer();
							setOpen(false);
						}}
					>
						Confirm
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
