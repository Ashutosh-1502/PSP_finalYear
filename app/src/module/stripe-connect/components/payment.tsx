"use client";

import { routes } from "@/config/routes";
import { useStripe, useElements, Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { APPEARANCE } from "@/module/stripe-connect/types";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);

export default function Payment() {
	const queryClient = useQueryClient();
	const stripeConnectClientSecret = queryClient.getQueryData<string>(["stripeConnectClientSecret"]);

	const options: StripeElementsOptions = {
		clientSecret: stripeConnectClientSecret,
		appearance: {
			theme: APPEARANCE.STRIPE,
			labels: APPEARANCE.FLOATING,
		},
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<CheckoutForm />
		</Elements>
	);
}

const CheckoutForm = () => {
	const router = useRouter();
	const stripe = useStripe();
	const elements = useElements();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const { error } = await stripe.confirmPayment({
			//`Elements` instance that was used to create the Payment Element
			elements,
			// This is needed so that the page is not redirected anywhere and there by causing the full refresh.
			redirect: "if_required",
		});

		if (error) {
			// This point will only be reached if there is an immediate error when
			// confirming the payment.
			toast.error(`Payment failed!`, {
				duration: 2000,
			});
			setErrorMessage(error.message as string);
		} else {
			toast.success(`Payment was successful!`, {
				duration: 2000,
			});
			router.push(routes.user.stripeConnect.productList);
		}
	};

	return (
		<div className="m-auto flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-3">Enter Card Details</h1>
			<form
				onSubmit={(event) => {
					void handleSubmit(event);
				}}
			>
				<PaymentElement />
				<div className="flex justify-center">
					<Button disabled={!stripe} className="mt-4 rounded-md border border-white p-2" type="submit">
						Submit
					</Button>
				</div>

				{errorMessage && <div>{errorMessage}</div>}
			</form>
		</div>
	);
};
