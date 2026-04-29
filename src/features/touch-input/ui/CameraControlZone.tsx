import type { ReactNode, Ref } from "react";

type CameraControlZoneProps = {
	children?: ReactNode;
	zoneRef: Ref<HTMLDivElement | null>;
};

export function CameraControlZone({
	children,
	zoneRef,
}: CameraControlZoneProps) {
	return (
		<div
			ref={zoneRef}
			id="camera-control-zone"
			className="pointer-events-auto absolute inset-0 touch-none select-none"
		>
			{children}
		</div>
	);
}

export type { CameraControlZoneProps };
