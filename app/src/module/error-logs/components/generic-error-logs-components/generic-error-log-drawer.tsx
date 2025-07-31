"use client";

import { FiEye } from "react-icons/fi";
import { NOT_APPLICABLE, type ErrorLogInfo } from "@/module/error-logs/types";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GenericErrorLogDrawer({ errorLogInfo }: { errorLogInfo: ErrorLogInfo }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<TooltipProvider>
			<Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
				<Tooltip>
					<TooltipTrigger asChild>
						<DrawerTrigger asChild>
							<span className="cursor-pointer rounded-md p-2">
								<FiEye />
							</span>
						</DrawerTrigger>
					</TooltipTrigger>
					<TooltipContent>View Details</TooltipContent>
				</Tooltip>

				<DrawerContent className="ml-auto h-full w-full max-w-2xl  border-l bg-white p-4 shadow-lg">
					<DrawerClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-900">✕</DrawerClose>
					<DrawerHeader>
						<h2 className="border-b pb-2 text-lg font-semibold">Additional Details</h2>
					</DrawerHeader>
					<div className="space-y-4 overflow-y-auto px-4 py-2">
						<div className="bg-red-100 rounded p-3 text-sm">
							<h4 className="font-semibold">Error Message:</h4>
							{errorLogInfo?.message}
						</div>
						<Tabs defaultValue="request" className="w-full">
							<TabsList className="mb-2 gap-2 rounded-md border border-black p-1">
								<TabsTrigger value="request">Request Object</TabsTrigger>
								<TabsTrigger value="context">User Context</TabsTrigger>
								<TabsTrigger value="stack">Stack Trace</TabsTrigger>
							</TabsList>

							<TabsContent value="request">
								{/* Request Object info */}
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-2">
										<h3>Request Info</h3>
										<p>
											<span className="font-bold">Timestamp:</span> {errorLogInfo.createdAt}
										</p>
										<p>
											<span className="font-bold">URL:</span> {errorLogInfo.request?.url}
										</p>
										<p>
											<span className="font-bold">Path:</span> {errorLogInfo.request?.path}
										</p>
									</div>
									<div className="flex flex-col gap-2">
										<h3>Request Headers</h3>
										{errorLogInfo.request?.headers
											? Object.entries(errorLogInfo.request.headers).map(([headerKey, headerValue], ind) => (
													<p key={ind}>
														<span className="font-bold">{headerKey}:</span> {headerValue}
													</p>
												))
											: NOT_APPLICABLE.N_A}
									</div>
									<div className="flex flex-col gap-2">
										<h3>Request Body</h3>
										{errorLogInfo.request?.body
											? Object.entries(errorLogInfo.request.body).map(([bodyKey, bodyValue], ind) => (
													<p key={ind}>
														<span className="font-bold">{bodyKey}:</span> {bodyValue}
													</p>
												))
											: NOT_APPLICABLE.N_A}
									</div>
									<div className="flex flex-col gap-2">
										<h3>Request Query</h3>
										{errorLogInfo.request?.query
											? Object.entries(errorLogInfo.request.query).map(([queryKey, queryValue], ind) => (
													<p key={ind}>
														<span className="font-bold">{queryKey}:</span> {queryValue}
													</p>
												))
											: NOT_APPLICABLE.N_A}
									</div>
									<div className="flex flex-col gap-2">
										<h3>Request Parameters</h3>
										{errorLogInfo.request?.params
											? Object.entries(errorLogInfo.request.params).map(([paramKey, paramValue], ind) => (
													<p key={ind}>
														<span className="font-bold">{paramKey}:</span> {paramValue}
													</p>
												))
											: NOT_APPLICABLE.N_A}
									</div>
								</div>
							</TabsContent>

							{/* User context info */}
							<TabsContent value="context">
								<div className="flex flex-col gap-2">
									<p>
										<span className="font-bold">User Reference:</span> {errorLogInfo.context?.userRef}
									</p>
									<p>
										<span className="font-bold">User Agent:</span> {errorLogInfo.context?.userAgent}
									</p>
									<p>
										<span className="font-bold">User IP:</span> {errorLogInfo.context?.ip}
									</p>
								</div>
							</TabsContent>

							{/* Error stack trace */}
							<TabsContent value="stack">
								<pre className="overflow-x-auto whitespace-pre-wrap rounded bg-gray-900 p-4 text-sm text-gray-100">
									{errorLogInfo?.stackTrace}
								</pre>
							</TabsContent>
						</Tabs>
					</div>
				</DrawerContent>
			</Drawer>
		</TooltipProvider>
	);
}
