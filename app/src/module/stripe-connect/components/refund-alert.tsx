import type { RefundAlertType } from "@/module/stripe-connect/types";
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

export function RefundAlert({ order, handleRefund }: RefundAlertType) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button disabled={order.isRefundEligible === false || order.refunded === true}>Refund</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Refund Order</AlertDialogTitle>

					<AlertDialogDescription>Are you sure you want to initiate a refund for this order?</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							handleRefund(order._id);
						}}
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
