import { Footprints } from "lucide-react";

import { useResponsiveLayout } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import {
	PLAYER_RUNNING_INDICATOR_CLASS_NAMES,
	PLAYER_RUNNING_INDICATOR_COPY,
	PLAYER_STATES,
} from "../config";

import { resolvePlayerRunningIndicatorVisibility } from "../lib";
import { type PlayerMovementState, usePlayerMachineRuntime } from "../model";

export function PlayerRunningIndicator() {
	const { isDesktopLayout } = useResponsiveLayout();
	const { snapshot } = usePlayerMachineRuntime();
	const movementState = snapshot.value[
		PLAYER_STATES.REGIONS.MOVEMENT
	] as PlayerMovementState;

	if (
		!resolvePlayerRunningIndicatorVisibility({
			isAvatarVisible: true,
			isDesktopLayout,
			movementState,
		})
	) {
		return null;
	}

	return (
		<div className={PLAYER_RUNNING_INDICATOR_CLASS_NAMES.ROOT}>
			<Badge
				aria-hidden="true"
				className={PLAYER_RUNNING_INDICATOR_CLASS_NAMES.BADGE}
				variant="outline"
			>
				<Footprints
					aria-hidden="true"
					className={PLAYER_RUNNING_INDICATOR_CLASS_NAMES.ICON}
				/>
				<span>{PLAYER_RUNNING_INDICATOR_COPY.LABEL}</span>
			</Badge>
		</div>
	);
}
