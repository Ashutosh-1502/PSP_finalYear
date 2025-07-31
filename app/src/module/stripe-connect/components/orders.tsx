"use client";

import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import toast from "react-hot-toast";
import { RefundAlert } from "@/module/stripe-connect/components/refund-alert";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";

export default function Orders() {
	const router = useRouter();
	const { useGetAllOrdersQuery, usePostRefundMutation } = useStripeConnectAPI();
	const { data: orders, isError, refetch: refetchOrders } = useGetAllOrdersQuery();

	const handleRefund = (id: string) => {
		usePostRefundMutation.mutate(id, {
			onSuccess: () => {
				toast.success(<p>Refund successful</p>, {
					duration: 2000,
				});
				void refetchOrders();
			},
			onError: () => {
				toast.error(<p>Refund failed!</p>, {
					duration: 2000,
				});
			},
		});
	};

	return (
		<div>
			<Button
				variant="outline"
				onClick={() => router.push(routes.user.stripeConnect.main)}
				className="flex items-center gap-2"
			>
				<IoMdArrowRoundBack className="h-4 w-4" />
				<span>Back</span>
			</Button>
			<h1 className="my-3">Past Orders Page</h1>
			<div className="flex flex-wrap gap-5">
				{orders &&
					orders.length > 0 &&
					orders.map((order) => (
						<div key={order._id} className="border-gray flex flex-col gap-2 rounded-md border p-2">
							<p>
								<span className="font-bold">Product Name: </span>
								{order.productName}
							</p>
							<p>
								<span className="font-bold">Product Price: </span>${order.amountPaid}
							</p>
							<p>
								{order.isRefundEligible ? (
									order.refunded ? (
										<i>*Refund Claimed</i>
									) : (
										<i>
											<strong>{10 - order.daysSinceOrder}</strong> days remaining to claim refund
										</i>
									)
								) : (
									<i>*This order is not eligible for refund</i>
								)}
							</p>
							<RefundAlert handleRefund={handleRefund} order={order} />
						</div>
					))}
				{orders && orders.length === 0 && <p>Nothing purchased yet !! 😊</p>}
				{isError && <h3>Error while fetching past orders</h3>}
			</div>
		</div>
	);
}
