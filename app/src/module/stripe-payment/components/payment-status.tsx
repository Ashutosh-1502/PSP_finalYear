"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { routes } from "@/config/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SESSION_STATUS } from "@/module/stripe-payment/types";
import { Button } from "@/components/ui/button";

function PaymentStatusContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [status, setStatus] = useState("");
	const { useGetSessionStatusQuery } = useStripePaymentAPI();
	const search = searchParams.get("session_id");
	const { data: sessionStatus } = useGetSessionStatusQuery(search);

	useEffect(() => {
		if (sessionStatus) {
			setStatus(sessionStatus.status);
		}
	}, [sessionStatus]);

	if (status === SESSION_STATUS.COMPLETE) {
		return (
			<section id="success">
				<h2 className="mb-5">Payment Successful !! 🎉</h2>
				<Button variant="outline" onClick={() => router.push(routes.user.stripePayment.productList)}>
					<IoMdArrowRoundBack /> Back to Products
				</Button>
			</section>
		);
	}

	return null;
}

export default function PaymentStatus() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaymentStatusContent />
		</Suspense>
	);
}
