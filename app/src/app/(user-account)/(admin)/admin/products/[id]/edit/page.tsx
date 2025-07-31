"use client";

import CreateEditProduct from "@/module/product/components/create-edit-product";
import { useProductAPI } from "@/module/product/hooks/useProducts";
import { COOKIES } from "@/types";
import Cookies from "js-cookie";

export default function EditProductPage({ params }: { params: { id: string } }) {
	const { useGetOneProductQuery } = useProductAPI();
	const companyRef = Cookies.get(COOKIES.COMPANY_REF);
	const { data: productData, isSuccess } = useGetOneProductQuery(params.id, companyRef as string);

	return <>{isSuccess && <CreateEditProduct id={params.id} product={productData} />}</>;
}
