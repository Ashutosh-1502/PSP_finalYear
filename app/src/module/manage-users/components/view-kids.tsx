import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type UserResponseType } from "@/module/manage-users/types/index";

export default function ParentChildrenTable({ users }: { users: UserResponseType[] }) {
	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-48 text-center">Parent Info</TableHead>
						<TableHead>Child Name</TableHead>
						<TableHead>Child Email</TableHead>
						<TableHead>Age</TableHead>
						<TableHead>Hobbies</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Points</TableHead>
						<TableHead>Screen Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((parent, parentIndex) => (
						<React.Fragment key={parentIndex}>
							{parent.children && parent.children.length > 0 ? (
								parent.children.map((child, childIndex) => (
									<TableRow key={childIndex} className="h-[60px]">
										{childIndex === 0 && (
											<TableCell
												rowSpan={parent.children.length}
												className="bg-gray-50 text-center align-middle font-medium"
											>
												<div>
													<div className="font-semibold">
														{parent.name.first} {parent.name.last}
													</div>
													<div className="text-sm text-muted-foreground">{parent.email}</div>
												</div>
											</TableCell>
										)}
										<TableCell>{child.name}</TableCell>
										<TableCell>{child.email}</TableCell>
										<TableCell>{child.age[0]}</TableCell>
										<TableCell>{child?.hobbies?.join(", ") || "No hobbies added"}</TableCell>
										<TableCell>{child.status}</TableCell>
										<TableCell>{child?.points || 0}</TableCell>
										<TableCell>
											{child.screenTime.hours}h {child.screenTime.minutes}m
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell className="bg-gray-50 text-center align-middle font-medium">
										<div>
											<div className="font-semibold">
												{parent.name.first} {parent.name.last}
											</div>
											<div className="text-sm text-muted-foreground">{parent.email}</div>
										</div>
									</TableCell>
									<TableCell colSpan={7} className="text-center italic text-gray-500">
										No kids have been added
									</TableCell>
								</TableRow>
							)}

							<TableRow>
								<TableCell colSpan={8} className="h-3 p-0" />
							</TableRow>
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
