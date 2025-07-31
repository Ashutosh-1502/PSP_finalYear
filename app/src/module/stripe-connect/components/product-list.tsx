"use client";

import { useStripeConnectAPI } from "@/module/stripe-connect/hooks/useStripeConnect";
import { useRouter } from "next/navigation";
import type { ProductInfo } from "@/module/stripe-connect/types";
import toast from "react-hot-toast";
import { routes } from "@/config/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function ProductList() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { useGetAllProductsQuery, usePostPaymentIntentMutation } = useStripeConnectAPI();
	const { data: productList, isLoading } = useGetAllProductsQuery();

	const getClientSecret = async (productId: string) => {
		try {
			const { mutateAsync } = usePostPaymentIntentMutation;
			const { clientSecret } = await mutateAsync(productId);
			return clientSecret;
		} catch (error) {
			toast.error(`Error getting the client secret`, { duration: 2000 });
			throw error;
		}
	};

	const handleBuy = async (product: ProductInfo) => {
		const clientSecret = await getClientSecret(product._id);
		// client-secret is stored in reach-query's cache.
		queryClient.setQueryData(["stripeConnectClientSecret"], clientSecret);
		router.push(routes.user.stripeConnect.payment(product._id));
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
			<h1 className="mt-3">Product List</h1>
			{isLoading && <p>Loading...</p>}
			<div className="mt-3 flex flex-wrap gap-3">
				{productList && productList.length > 0 ? (
					productList.map((product) => (
						<div key={product._id} className="flex flex-col gap-3 rounded-md border p-2">
							<p>
								<span className="font-bold">Product Name:</span> {product.title}
							</p>
							<p>
								<span className="font-bold">Price:</span> ${product.price}
							</p>
							<Button onClick={() => void handleBuy(product)}>Buy</Button>
						</div>
					))
				) : (
					<p>No products available !!</p>
				)}
			</div>
		</div>
	);
}
