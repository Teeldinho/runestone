import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";

import {
	INPUT_EVENT_TYPES,
	MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES,
} from "../config";
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
			className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.ROOT}
		>
			<button
				type="button"
				className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.BUTTON}
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
				className={MOBILE_ACTION_BUTTON_LAYOUT_CLASS_NAMES.BUTTON}
				onPointerDown={(event) => {
					event.preventDefault();
					event.stopPropagation();
					sendInput({ type: INPUT_EVENT_TYPES.JUMP_PRESSED });
				}}
			>
				Jump
			</button>
		</div>
	);
}

export type { MobileActionButtonZoneProps };
