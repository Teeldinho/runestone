import { ChevronsUp, Footprints } from "lucide-react";

import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";
import { Button } from "@/shared/ui";

import { MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES } from "../config";
import {
	type InputOrchestratorEvent,
	useMobileActionButtonZoneModel,
} from "../model";

type MobileActionButtonZoneProps = {
	readonly isRunEnabled: boolean;
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

export function MobileActionButtonZone({
	isRunEnabled,
	sendInput,
}: MobileActionButtonZoneProps) {
	const viewModel = useMobileActionButtonZoneModel({
		isRunEnabled,
		sendInput,
	});

	return (
		<div
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.DISCRETE_ACTION,
				[INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK]:
					INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE,
			}}
			className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.ROOT}
		>
			<Button
				type="button"
				className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.BUTTON}
				size="icon"
				variant={viewModel.runButtonVariant}
				aria-label={viewModel.runAriaLabel}
				aria-pressed={viewModel.runButtonPressed}
				onPointerDown={viewModel.handleRunPointerDown}
				onClick={viewModel.handleRunClick}
			>
				<Footprints
					aria-hidden="true"
					className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.ICON}
				/>
			</Button>

			<Button
				type="button"
				className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.BUTTON}
				size="icon"
				variant={viewModel.jumpButtonVariant}
				aria-label={viewModel.jumpAriaLabel}
				onPointerDown={viewModel.handleJumpPointerDown}
				onPointerUp={viewModel.handleJumpPointerUp}
				onPointerCancel={viewModel.handleJumpPointerCancel}
				onLostPointerCapture={viewModel.handleJumpLostPointerCapture}
				onClick={viewModel.handleJumpClick}
			>
				<ChevronsUp
					aria-hidden="true"
					className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.ICON}
				/>
			</Button>
		</div>
	);
}

export type { MobileActionButtonZoneProps };
