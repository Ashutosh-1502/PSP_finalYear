"use client";

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { type CheckoutFormType } from "@/module/stripe-payment/types";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);

export default function CheckoutForm({ productId }: CheckoutFormType) {
	const router = useRouter();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const { usePostCheckoutSessionMutation } = useStripePaymentAPI();
	const { mutate: postCheckoutSession, isError, error } = usePostCheckoutSessionMutation;
	const sessionIdRef = useRef<string>("");

	useEffect(() => {
		postCheckoutSession(productId, {
			onSuccess: (data) => {
				setClientSecret(data.clientSecret);
				sessionIdRef.current = data.sessionId;
			},
		});
	}, [postCheckoutSession, productId]);

	const options = {
		fetchClientSecret: () =>
			clientSecret ? Promise.resolve(clientSecret) : Promise.reject("No client secret available"),
	};

	if (isError) {
		return <div>Error: {error instanceof Error ? error.message : "An error occurred"}</div>;
	}

	if (!clientSecret) {
		return <div>Loading...</div>;
	}

	const handleComplete = () => {
		router.push(routes.user.stripePayment.paymentStatus(sessionIdRef.current));
	};

	return (
		<div id="checkout">
			<EmbeddedCheckoutProvider stripe={stripePromise} options={{ ...options, onComplete: handleComplete }}>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
}
