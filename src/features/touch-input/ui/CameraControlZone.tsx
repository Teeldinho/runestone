import type { PointerEvent, ReactNode, Ref } from "react";

import { INPUT_POINTER_DATA_ATTRIBUTES, POINTER_ROLES } from "@/shared/config";
import { shouldBlockLookFromPointerTarget } from "@/shared/lib";

type CameraControlZoneProps = {
	readonly children?: ReactNode;
	readonly zoneRef: Ref<HTMLDivElement | null>;
	readonly onLookPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
	readonly onLookPointerCancel?: (event: PointerEvent<HTMLDivElement>) => void;
};

export function CameraControlZone({
	children,
	zoneRef,
	onLookPointerDown,
	onLookPointerMove,
	onLookPointerUp,
	onLookPointerCancel,
}: CameraControlZoneProps) {
	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (shouldBlockLookFromPointerTarget({ target: event.target })) {
			return;
		}

		onLookPointerDown?.(event);
	};

	return (
		<div
			ref={zoneRef}
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.LOOK,
			}}
			className="pointer-events-auto absolute inset-0 touch-none select-none"
			onPointerDown={handlePointerDown}
			{...(onLookPointerMove ? { onPointerMove: onLookPointerMove } : {})}
			{...(onLookPointerUp ? { onPointerUp: onLookPointerUp } : {})}
			{...(onLookPointerCancel ? { onPointerCancel: onLookPointerCancel } : {})}
		>
			{children}
		</div>
	);
}

export type { CameraControlZoneProps };
