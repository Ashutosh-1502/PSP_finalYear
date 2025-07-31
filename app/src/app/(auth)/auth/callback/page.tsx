"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/services/supabase-client";

// This page is used to handle the callback URL during the Social-Sign's OAuth flow.
export default function AuthCallback() {
	useEffect(() => {
		const handleCallback = () => {
			try {
				const { hash } = window.location;

				if (hash) {
					supabase.auth.onAuthStateChange((event) => {
						if (event === "SIGNED_IN") {
							window.close();
						}
					});
				} else {
					window.close();
				}
			} catch (error) {
				window.close();
			}
		};

		handleCallback();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-xl font-semibold">Completing authentication...</h1>
				<p className="mt-2 text-gray-600">This window will close automatically.</p>
			</div>
		</div>
	);
}
