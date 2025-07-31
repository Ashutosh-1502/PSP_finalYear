"use client";

import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CustomerStripeConnect() {
	const router = useRouter();
	const { useGetCustomerQuery } = useStripeConnectAPI();
	const { data: customerData, refetch: refetchCustomerData } = useGetCustomerQuery();
	const { usePostCustomerIdMutation } = useStripeConnectAPI();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignup = () => {
		setIsLoading(true);
		usePostCustomerIdMutation.mutate(undefined, {
			onSuccess: () => {
				toast.success(`Signup successful`, {
					duration: 2000,
				});
				void refetchCustomerData();
				setIsLoading(false);
			},
			onError: () => {
				toast.error(`Error while signing up`, {
					duration: 2000,
				});
				setIsLoading(false);
			},
		});
	};

	return (
		<div>
			<h1>Customer Stripe Connect - Demo</h1>
			<div className="flex flex-col gap-5">
				<div className="mt-3 rounded-md border border-dotted p-2">
					{customerData && customerData.stripeCustomerId ? (
						<p>
							<span className="font-bold">Your Stripe Customer Id is: </span>
							{customerData.stripeCustomerId}
						</p>
					) : (
						<p>Sign up as a stripe customer</p>
					)}

					<Button
						className="mt-2"
						disabled={customerData?.stripeCustomerId !== undefined || isLoading}
						onClick={handleSignup}
					>
						{isLoading ? <Loader2 className="h-4 w-8 animate-spin" /> : "Signup"}
					</Button>
				</div>
				<div className="rounded-md border border-dotted p-2">
					<Button onClick={() => router.push(routes.user.stripeConnect.productList)}>Show Products</Button>
				</div>
				<div className="rounded-md border border-dotted p-2">
					<Button onClick={() => router.push(routes.user.stripeConnect.pastOrders)}>Past Orders</Button>
				</div>
			</div>
		</div>
	);
}
