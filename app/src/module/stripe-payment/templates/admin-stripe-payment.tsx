"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";

export default function AdminStripePaymentFlow() {
	const router = useRouter();

	return (
		<>
			<h1 className="mb-3">Stripe Payment - Demo</h1>
			<div className="border-gray flex gap-5 rounded-md border p-2">
				<Button onClick={() => router.push(routes.admin.stripePayment.createProduct)}>Create Product</Button>
				<Button onClick={() => router.push(routes.admin.stripePayment.coupons)}>Coupons Page</Button>
			</div>
		</>
	);
}
