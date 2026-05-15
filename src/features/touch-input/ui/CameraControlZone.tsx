import type { Ref } from "react";

import { INPUT_POINTER_DATA_ATTRIBUTES, POINTER_ROLES } from "@/shared/config";

type CameraControlZoneProps = {
	readonly zoneRef: Ref<HTMLDivElement | null>;
};

export function CameraControlZone({ zoneRef }: CameraControlZoneProps) {
	return (
		<div
			ref={zoneRef}
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.LOOK,
			}}
			className="pointer-events-auto absolute inset-0 z-20 touch-none select-none"
		/>
	);
}

export type { CameraControlZoneProps };
