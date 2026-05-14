import type { PointerEvent, Ref } from "react";

import { INPUT_POINTER_DATA_ATTRIBUTES, POINTER_ROLES } from "@/shared/config";
import { shouldBlockLookFromPointerTarget } from "@/shared/lib";

type CameraControlZoneProps = {
	readonly zoneRef: Ref<HTMLDivElement | null>;
	readonly onLookPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerCancel?: (event: PointerEvent<HTMLDivElement>) => void;
};

export function CameraControlZone({
	zoneRef,
	onLookPointerDown,
	onLookPointerMove,
	onLookPointerUp,
	onLookPointerCancel,
}: CameraControlZoneProps) {
	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (!onLookPointerDown) {
			return;
		}

		if (shouldBlockLookFromPointerTarget({ target: event.target })) {
			return;
		}

		onLookPointerDown(event);
	};

	return (
		<div
			ref={zoneRef}
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.LOOK,
			}}
			className="pointer-events-auto absolute inset-0 z-20 touch-none select-none"
			onPointerDown={handlePointerDown}
			onPointerMove={onLookPointerMove}
			onPointerUp={onLookPointerUp}
			onPointerCancel={onLookPointerCancel}
		/>
	);
}

export type { CameraControlZoneProps };
