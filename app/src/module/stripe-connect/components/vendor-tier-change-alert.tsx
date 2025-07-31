import { useRef } from "react";
import { RiExchangeFundsLine } from "react-icons/ri";
import { TIER, type VendorTierChangeAlertType } from "@/module/stripe-connect/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// This is part of `super-admin` flow.
export function VendorTierChangeAlert({ vendor, handleUpdate }: VendorTierChangeAlertType) {
	const cancelRef = useRef<HTMLButtonElement>(null);

	const newStatus = vendor.tier === TIER.TIER1 ? TIER.TIER2 : TIER.TIER1;

	return (
		<AlertDialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<span>
							<AlertDialogTrigger asChild>
								<div className="cursor-pointer rounded-md border p-2">
									<RiExchangeFundsLine />
								</div>
							</AlertDialogTrigger>
						</span>
					</TooltipTrigger>
					<TooltipContent side="top">Change Vendor Tier</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change Tier</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to change the status to{" "}
						<Badge variant={(vendor.tier as string) === TIER.TIER2 ? "default" : "destructive"}>
							{newStatus}
						</Badge>
						?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel ref={cancelRef} asChild>
						<Button variant="outline">Cancel</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							onClick={() => {
								handleUpdate(vendor.stripeAccountId, newStatus);
							}}
						>
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
