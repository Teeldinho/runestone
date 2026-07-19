import { DoorOpen } from "lucide-react";

import { Button, Skeleton } from "@/shared/ui";

import { HOME_ENTRY_ACTION_CLASS_NAMES } from "../config";

type HomeEntryActionSkeletonProps = {
	label: string;
};

export function HomeEntryActionSkeleton({
	label,
}: HomeEntryActionSkeletonProps) {
	return (
		<div className={HOME_ENTRY_ACTION_CLASS_NAMES.ROOT} aria-busy="true">
			<Button
				type="button"
				disabled
				size="lg"
				variant="dungeon-gold"
				className={HOME_ENTRY_ACTION_CLASS_NAMES.BUTTON}
			>
				<DoorOpen aria-hidden="true" />
				{label}
			</Button>
			<Skeleton
				aria-hidden="true"
				className={HOME_ENTRY_ACTION_CLASS_NAMES.STATUS_SKELETON}
			/>
		</div>
	);
}
