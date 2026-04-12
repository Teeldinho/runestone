import type { ReactNode, Ref } from "react";

type CameraControlZoneProps = {
	children?: ReactNode;
	zoneRef: Ref<HTMLDivElement | null>;
};

/**
 * A transparent overlay zone that restricts camera rotation/pan inputs
 * to the right half of the screen on mobile/tablet devices.
 */
export function CameraControlZone({
	children,
	zoneRef,
}: CameraControlZoneProps) {
	return (
		<div
			ref={zoneRef}
			id="camera-control-zone"
			className="pointer-events-auto absolute inset-y-0 right-0 w-1/2 touch-none select-none"
		>
			{children}
		</div>
	);
}

export type { CameraControlZoneProps };
