import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";

import { INPUT_EVENT_TYPES } from "../config";
import type { InputOrchestratorEvent } from "../model";

type MobileActionButtonZoneProps = {
	readonly sendInput: (event: InputOrchestratorEvent) => void;
};

export function MobileActionButtonZone({
	sendInput,
}: MobileActionButtonZoneProps) {
	return (
		<div
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.DISCRETE_ACTION,
				[INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK]:
					INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE,
			}}
			className="pointer-events-auto absolute bottom-6 right-6 grid grid-cols-2 gap-3 touch-none select-none"
		>
			<button
				type="button"
				className="rounded-full border border-panel-border/80 bg-panel/80 px-4 py-3 text-sm font-semibold"
				onPointerDown={(event) => {
					event.preventDefault();
					event.stopPropagation();
					sendInput({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });
				}}
			>
				Run
			</button>

			<button
				type="button"
				className="rounded-full border border-panel-border/80 bg-panel/80 px-4 py-3 text-sm font-semibold"
				onPointerDown={(event) => {
					event.preventDefault();
					event.stopPropagation();
					sendInput({ type: INPUT_EVENT_TYPES.JUMP_PRESSED });
				}}
			>
				Jump
			</button>

			<button
				type="button"
				className="rounded-full border border-panel-border/80 bg-panel/80 px-4 py-3 text-sm font-semibold"
				onPointerDown={(event) => {
					event.preventDefault();
					event.stopPropagation();
					sendInput({ type: INPUT_EVENT_TYPES.INTERACT_PRESSED });
				}}
			>
				Open
			</button>

			<button
				type="button"
				className="rounded-full border border-panel-border/80 bg-panel/80 px-4 py-3 text-sm font-semibold"
				onPointerDown={(event) => {
					event.preventDefault();
					event.stopPropagation();
					sendInput({ type: INPUT_EVENT_TYPES.ATTACK_PRESSED });
				}}
			>
				Attack
			</button>
		</div>
	);
}

export type { MobileActionButtonZoneProps };
