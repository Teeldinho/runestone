import type { Vector3 } from "three";
import type { Vector3Tuple } from "@/shared/lib";

type SyncOrbitControlsTargetInput = {
	readonly controls: {
		readonly target: Vector3;
	};
	readonly target: Vector3Tuple;
};

export const syncOrbitControlsTarget = ({
	controls,
	target,
}: SyncOrbitControlsTargetInput): void => {
	controls.target.set(...target);
};
