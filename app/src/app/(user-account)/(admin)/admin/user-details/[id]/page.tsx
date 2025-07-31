"use client";

import { useRouter } from "next/navigation";
import { useAdminUserAPI } from "@/module/teams/hooks/useAdminUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ParamsType = {
	id: string;
};

export default function UserDetailsPage({ params }: { params: ParamsType }) {
	const router = useRouter();
	const { useGetOneUserQuery } = useAdminUserAPI();

	// Fetch user data
	const { data: userData, isSuccess, isLoading } = useGetOneUserQuery(params.id);

	// Function to handle back button click
	const handleBack = () => {
		router.back();
	};

	return (
		<div className="p-4">
			{/* Back button */}
			<Button variant="outline" onClick={handleBack} className="mb-6">
				Back
			</Button>
			{/* Display user details or loading spinner */}
			{isLoading ? (
				<p className="text-sm">loading...</p>
			) : isSuccess ? (
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-bold">User Details</h2>
					</CardHeader>
					{/* Display user details */}
					<CardContent>
						<div className="flex items-center">
							<p className="w-15 font-semibold">Name: </p>
							<p>{userData?.data?.fullName}</p>
						</div>
						<div className="flex items-center">
							<p className="w-15 font-semibold">Email: </p>
							<p>{userData?.data?.email}</p>
						</div>
						<div className="flex items-center">
							<p className="w-15 font-semibold">Role: </p>
							<p>{userData?.data?.roles}</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<p className="text-red-500">Failed to load user details.</p>
			)}
		</div>
	);
}
