"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useStripePaymentAPI } from "@/module/stripe-payment/hooks/useStripePayment";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";

export default function ProductList() {
	const router = useRouter();
	const { useGetAllProductsQuery } = useStripePaymentAPI();
	const { data: productList, isLoading, isError } = useGetAllProductsQuery();

	return (
		<div>
			<Button onClick={() => router.push(routes.user.stripePayment.main)} variant="outline">
				<IoMdArrowRoundBack /> Back
			</Button>
			<h1 className="mt-3">Product List</h1>
			{isLoading && <p>Loading...</p>}
			<div className="mt-3 flex flex-wrap gap-3">
				{productList &&
					productList.length > 0 &&
					productList.map((product) => (
						<div key={product._id} className="flex flex-col gap-3 rounded-md border p-2">
							<p>
								<span className="font-bold">Product Name:</span> {product.title}
							</p>
							<p>
								<span className="font-bold">Price:</span> ${product.price}
							</p>
							<Button onClick={() => router.push(routes.user.stripePayment.checkout(product._id))}>Buy</Button>
						</div>
					))}
				{productList && productList.length === 0 && <p>No products added yet !!</p>}
				{isError && <p>Error fetching products !!</p>}
			</div>
		</div>
	);
}
