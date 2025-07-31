"use client";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";

export default function CustomerStripePayment() {
	const router = useRouter();

	return (
		<div>
			<h1 className="mb-3">Customer Stripe Payment - Demo</h1>
			<div className="flex flex-col gap-5">
				<div className="rounded-md border border-dotted p-2">
					<Button onClick={() => router.push(routes.user.stripePayment.productList)}>Show Products</Button>
				</div>
				<div className="rounded-md border border-dotted p-2">
					<Button onClick={() => router.push(routes.user.stripePayment.pastOrders)}>Past Orders</Button>
				</div>
			</div>
		</div>
	);
}
