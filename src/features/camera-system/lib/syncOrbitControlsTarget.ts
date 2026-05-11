import type { Group, Vector3 } from "three";

type SyncOrbitControlsTargetInput = {
	readonly controls: {
		readonly target: Vector3;
	};
	readonly targetObject: Group;
};

export const syncOrbitControlsTarget = ({
	controls,
	targetObject,
}: SyncOrbitControlsTargetInput): void => {
	controls.target.copy(targetObject.position);
};
