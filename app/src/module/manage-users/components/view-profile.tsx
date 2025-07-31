import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ACTION, type UserDetailsProps } from "@/module/manage-users/types/index";
import { getDate } from "@/module/manage-users/utils/index";

export default function UserDetails({ user, onConfirm }: UserDetailsProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<p>View User</p>
			</DialogTrigger>
			<DialogContent className="max-w-[500px] rounded-xl px-6 pb-4 pt-6">
				<div className="flex flex-col gap-4">
					{/* User Info */}
					<div className="flex items-center gap-4">
						<Avatar>
							<AvatarImage src={user?.profileImage || "https://i.pravatar.cc/100?img=12"} />
							<AvatarFallback>EL</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="text-lg font-semibold">{`${user.name.first} ${user.name.last}`}</h2>
							<p className="text-sm text-muted-foreground">{user.email}</p>
							<p className="text-sm text-muted-foreground">{user?.phone || "Not Provided"}</p>
						</div>
					</div>

					{/* Kids Added */}
					<div>
						<h3 className="mb-2 text-sm font-medium">Kids added</h3>
						<div className="space-y-3">
							{user.children.length &&
								user.children.map((kid, idx) => (
									<div key={idx} className="flex items-center justify-between rounded-lg bg-muted p-3">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage src={kid?.avatar || "/assets/svg/placeholder-profile.svg"} />
												<AvatarFallback>S</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{kid.name}</p>
												<p className="text-sm text-muted-foreground">{kid.age.charAt(0)} years</p>
											</div>
										</div>
										<p className="text-sm text-muted-foreground">
											Added on
											<br />
											{getDate(kid.createdAt)}
										</p>
									</div>
								))}
						</div>
					</div>

					<div>
						<h3 className="mb-2 text-sm font-medium">Subscription plan</h3>
						<div className="rounded-lg bg-muted p-4">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Your current plan</p>
									<h4 className="text-lg font-semibold">Yearly</h4>
									<p className="text-sm text-muted-foreground">$20.83/month. Billed annually</p>
								</div>
								<p className="text-right text-lg font-semibold">$249.00</p>
							</div>
							<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
								<li>Loerm ipsum dolor sit et ust ipsum dolor sit et ust</li>
								<li>Loerm ipsum dolor sit et ust ipsum dolor sit et ust</li>
							</ul>
						</div>
					</div>

					<DialogFooter className="mt-4 flex flex-row justify-between gap-4">
						<DialogClose>
							<Button
								variant="outline"
								className="border-red-600 text-red-600 hover:bg-red-50"
								onClick={() => onConfirm(ACTION.DELETED, user)}
							>
								Delete
							</Button>
						</DialogClose>
						<DialogClose>
							<Button className="bg-black text-white hover:bg-gray-900" onClick={() => onConfirm(ACTION.BLOCKED, user)}>
								Block
							</Button>
						</DialogClose>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
