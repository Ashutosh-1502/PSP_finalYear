import CheckoutForm from "@/module/stripe-payment/components/checkout-form";

type CheckoutFormPageProps = {
	params: {
		id: string;
	};
};

export default function CheckoutFormPage({ params }: CheckoutFormPageProps) {
	return <CheckoutForm productId={params.id} />;
}
