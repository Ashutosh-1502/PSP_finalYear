"use client";

import { useEffect, useRef, useState } from "react";

export default function ProteinViewerPage() {
	const viewerRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file || typeof window === "undefined" || !window.$3Dmol) {
			setError("3Dmol.js not loaded.");
			return;
		}

		const reader = new FileReader();
		reader.onload = function (e) {
			const pdbData = e.target?.result;
			if (typeof pdbData !== "string") {
				setError("Invalid file content.");
				return;
			}

			try {
				const viewer = window.$3Dmol.createViewer(viewerRef.current!, {
					backgroundColor: "transparent",
				});

				viewer.clear();
				viewer.addModel(pdbData, "pdb");
				viewer.setStyle({}, { cartoon: { color: "spectrum" } });
				viewer.zoomTo();
				viewer.render();
			} catch (err) {
				console.error("3Dmol.js error:", err);
				setError("Error rendering the PDB structure.");
			}
		};
		reader.readAsText(file);
	};

	return (
		<div>
			<h1 className="mb-4 text-2xl font-bold">Protein Viewer</h1>

			<input type="file" accept=".pdb" onChange={handleFileUpload} className="mb-6 block" />

			{error && <p className="mb-4 text-red-500">{error}</p>}

			<div
				ref={viewerRef}
				className="relative h-[500px] w-full overflow-hidden border border-gray-300 bg-white"
			/>
		</div>
	);
}
