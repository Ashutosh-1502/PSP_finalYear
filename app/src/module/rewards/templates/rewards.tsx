"use client";

import { useState } from "react";
import { Pagination } from "@/components/common/pagination/pagination";
import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import { accessCheck } from "@/lib/utils/access-check";
import { COOKIES } from "@/types";
import { useRewardAPI } from "@/module/rewards/hooks/useRewards";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import SearchBox from "@/components/common/search-box/search-box";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { GripVertical, MoreVertical } from "lucide-react";
import { ACTION, type RewardResponseType } from "@/module/rewards/types/index";
import EnableDisableReward from "@/module/rewards/components/disable-enable-reward-alert";
import DeleteReward from "@/module/rewards/components/delete-reward-alert";
import CreateEditReward from "@/module/rewards/components/create-edit-reward";
import { getDate } from "@/module/rewards/utils/form-utils";
import ViewReward from "@/module/rewards/components/view-reward";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

export default function Rewards() {
	const userType = Cookies.get(COOKIES.USER_TYPE) as string;
	const isAdmin = accessCheck(userType);
	const [searchValue, setSearchValue] = useState<string>("");
	const [value, setValue] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const companyRef = Cookies.get(COOKIES.COMPANY_REF) as string;
	const { useGetAllRewardsQuery, useManageRewardMutation, useUpdateRewardSequenceMutation } = useRewardAPI();

	const debouncedSetSearchValue = debounce((value: string) => {
		setSearchValue(value);
	}, 300);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		setValue(value);
		debouncedSetSearchValue(value);
	};

	const onManageReward = (id: string, operation: ACTION) => {
		const actionText =
			operation === ACTION.ACTIVE ? "Enabled" : operation === ACTION.DELETED ? "Deleted Successfully" : "Disabled";
		useManageRewardMutation.mutate(
			{ id, operation },
			{
				onSuccess: () => {
					void refetchRewards();
					toast.success(`Reward ${actionText} Successfully`, {
						duration: 2000,
					});
				},
				onError: () => {
					toast.error(`${actionText} operation failed`, {
						duration: 2000,
					});
				},
			}
		);
	};

	const handleRewardManagement = (operation: ACTION, id: string) => {
		onManageReward(id, operation);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage < 1) return;
		if (newPage > totalPages) return;
		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
	};

	const {
		data: rewardData,
		isSuccess,
		refetch: refetchRewards,
	} = useGetAllRewardsQuery({ searchValue, page, pageSize, companyRef }, onManageReward);

	const totalDocs = (rewardData && rewardData[0].total) || 0;
	const totalPages = Math.ceil(((rewardData && rewardData[0]?.total) || 0) / pageSize);

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) return;

		const sourceSequence = source.index;
		const destinationSequence = destination.index;

		if (sourceSequence === destinationSequence) return;
		const rewardList = (isSuccess && rewardData && rewardData[0]?.items) || [];

		const sourceIndex = rewardList[sourceSequence]?.sequence;
		const destinationIndex = rewardList[destinationSequence]?.sequence;

		if (sourceSequence != null && destinationSequence != null) {
			useUpdateRewardSequenceMutation.mutate(
				{
					sourceIndex,
					destinationIndex,
				},
				{
					onSuccess: () => {
						void refetchRewards();
					},
				}
			);
		}
	};

	return (
		<>
			<div className="items-centre mb-6 flex justify-between">
				<SearchBox variant="outline" value={value} onChange={handleInputChange} placeholder="Search for a reward" />
				{isAdmin && (
					<CreateEditReward>
						<Button className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
							<PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
							Create
						</Button>
					</CreateEditReward>
				)}
			</div>

			<div className="mx-auto flex w-full max-w-6xl flex-col gap-y-4 rounded-2xl border border-gray-200 bg-white shadow-lg md:p-6">
				{/* drag and drop info */}
				<div className="rounded-md bg-[#FFF7ED] px-2 py-2">
					<p className="text-sm text-gray-500">Hold & drag to rearrange the rewards</p>
				</div>

				{/* list of rewards */}
				<div className="flex-1">
					<Table>
						<TableHeader className="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
							<TableRow>
								<TableHead>Reward Name</TableHead>
								<TableHead>Creation Date</TableHead>
								<TableHead>Points Required</TableHead>
								<TableHead>Color Assigned</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId={"rewards"}>
								{(droppableProvided) => (
									<TableBody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
										{isSuccess && rewardData && rewardData[0]?.items?.length ? (
											rewardData[0].items.map((reward: RewardResponseType, index) => (
												<Draggable key={reward.sequence} draggableId={String(reward.sequence)} index={index}>
													{(provided) => (
														<TableRow className="h-20 border-none" ref={provided.innerRef} {...provided.draggableProps}>
															<TableCell>
																<div className="flex space-y-4">
																	<button {...provided.dragHandleProps} className="cursor-grab">
																		<GripVertical className="text-neutral-500" size={12} />
																	</button>
																	{reward.title}
																</div>
															</TableCell>
															<TableCell>{getDate(reward.createdAt)}</TableCell>
															<TableCell>{reward.points}</TableCell>
															<TableCell>
																<Popover>
																	<PopoverTrigger asChild>
																		<Button variant="outline">Show Hexcode</Button>
																	</PopoverTrigger>
																	<PopoverContent className="w-40">
																		<div className="flex flex-col space-y-2">
																			{reward.colorHash.length &&
																				reward.colorHash.map((code) => (
																					<div className="flex items-center space-x-2" key={code}>
																						<div className="h-4 w-4 rounded-md" style={{ backgroundColor: code }}></div>
																						<span className="text-sm font-semibold text-black">{code}</span>
																					</div>
																				))}
																		</div>
																	</PopoverContent>
																</Popover>
															</TableCell>
															<TableCell>
																<div className="flex items-center">
																	{
																		<EnableDisableReward
																			title={reward.title}
																			operation={reward.status === ACTION.ACTIVE ? ACTION.INACTIVE : ACTION.ACTIVE}
																			onConfirm={() =>
																				handleRewardManagement(
																					reward.status === ACTION.ACTIVE ? ACTION.INACTIVE : ACTION.ACTIVE,
																					reward._id
																				)
																			}
																		>
																			<Switch id={reward._id} checked={reward.status === ACTION.ACTIVE} />
																		</EnableDisableReward>
																	}

																	<Popover>
																		<PopoverTrigger asChild>
																			<Button variant="ghost" size="icon">
																				<MoreVertical className="h-5 w-5" />
																			</Button>
																		</PopoverTrigger>

																		<PopoverContent className="w-48 p-0">
																			<div className="flex flex-col">
																				<ViewReward
																					reward={reward}
																					onConfirm={() => {
																						handleRewardManagement(ACTION.DELETED, reward._id);
																					}}
																				/>

																				<CreateEditReward reward={reward} id={reward._id}>
																					<p className="flex justify-center py-2 hover:bg-gray-100">Edit Reward</p>
																				</CreateEditReward>
																				<button className={`px-4 py-2 text-left text-center hover:bg-gray-100 																	`}>
																					<DeleteReward
																						title={reward.title}
																						onConfirm={() => {
																							handleRewardManagement(ACTION.DELETED, reward._id);
																						}}
																					/>
																				</button>
																			</div>
																		</PopoverContent>
																	</Popover>
																</div>
															</TableCell>
														</TableRow>
													)}
												</Draggable>
											))
										) : (
											<TableRow>
												<TableCell colSpan={6} className="py-5 text-center">
													<p className="mt-3">No reward Data Available</p>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								)}
							</Droppable>
						</DragDropContext>
					</Table>
				</div>

				<div className="mt-auto">
					<Pagination
						page={page}
						pageSize={pageSize}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						totalPages={totalPages}
						totalDocs={totalDocs}
					/>
				</div>
			</div>
		</>
	);
}
