"use client";

import toast from "react-hot-toast";
import { RefundAlert } from "@/module/stripe-payment/components/refund-alert";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { Button } from "@/components/ui/button";

export default function Orders() {
	const router = useRouter();
	const { useGetAllOrdersQuery, usePostRefundMutation } = useStripePaymentAPI();
	const { data: orders, isError, refetch: refetchOrders } = useGetAllOrdersQuery();

	const handleRefund = (id: string) => {
		usePostRefundMutation.mutate(id, {
			onSuccess: () => {
				toast.success(<p>Refund successfull</p>, {
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
			<Button onClick={() => router.push(routes.user.stripePayment.main)} variant="outline">
				<IoMdArrowRoundBack /> Back
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
							<p>{order.refunded ? <i>*Refund Claimed</i> : <i>*Eligible for refund</i>}</p>
							<RefundAlert handleRefund={handleRefund} order={order} />
						</div>
					))}
				{orders && orders.length === 0 && <p>Nothing purchased yet !! 😊</p>}
				{isError && <h3>Error while fetching past orders</h3>}
			</div>
		</div>
	);
}
