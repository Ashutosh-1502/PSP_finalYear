"use client";

import { useCallback, useEffect, useState } from "react";
import { loadConnectAndInitialize, type StripeConnectInstance } from "@stripe/connect-js";
import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import toast from "react-hot-toast";

export const useStripeConnectInstance = (accountId: string) => {
	const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance>();
	const { usePostAccountSessionMutation } = useStripeConnectAPI();
	const { mutateAsync } = usePostAccountSessionMutation;

	const fetchClientSecret = useCallback(async () => {
		try {
			const data = await mutateAsync({ accountId });
			const clientSecret = data.data.clientSecret;
			return clientSecret;
		} catch (error) {
			toast.error(`Error while getting client secret`, {
				duration: 2000,
			});
			throw error;
		}
	}, [mutateAsync, accountId]);

	useEffect(() => {
		if (accountId) {
			setStripeConnectInstance(
				loadConnectAndInitialize({
					publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY as string,
					fetchClientSecret,
					appearance: {
						overlays: "dialog",
						variables: {
							colorPrimary: "#000000",
						},
					},
				})
			);
		}
	}, [accountId, fetchClientSecret]);

	return stripeConnectInstance;
};
