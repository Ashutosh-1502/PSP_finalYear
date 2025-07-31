"use client";

import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { RewardResponseType } from "@/module/rewards/types/index";
import { getDate } from "@/module/rewards/utils/form-utils";
import DeleteReward from "@/module/rewards/components/delete-reward-alert";
import CreateEditReward from "@/module/rewards/components/create-edit-reward";

export default function ViewReward({ reward, onConfirm }: { reward: RewardResponseType; onConfirm: () => void }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<p className="flex justify-center py-2 hover:bg-gray-100">View Rewards</p>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<div className="flex items-start justify-between">
					<div>
						<h2 className="flex items-center gap-1 text-xl font-semibold">{reward.title}</h2>
					</div>
				</div>

				<p className="text-sm text-muted-foreground">Subtitle</p>
				<p className="text-sm">{reward.subTitle}</p>

				<p className="text-sm text-muted-foreground">Description</p>
				<p className="text-sm">{reward.description}</p>

				<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">Creation date</p>
						<p className="font-medium">{getDate(reward.createdAt)}</p>
					</div>
					<div>
						<p className="text-muted-foreground">Required points</p>
						<p className="font-medium">{reward.points} points</p>
					</div>
				</div>

				<DialogFooter className="mt-6 flex justify-between">
					<Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
						<DeleteReward title={reward.title} onConfirm={onConfirm} />
					</Button>
					<DialogClose asChild>
						<CreateEditReward id={reward._id} reward={reward}>
							<Button>Edit</Button>
						</CreateEditReward>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
