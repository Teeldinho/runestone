import type { Vector3Tuple } from "@/shared/types";

type ResolveJoystickVectorInput = {
	deltaX: number;
	deltaY: number;
	maxRadiusPx: number;
	deadZoneRatio: number;
};

type JoystickVectorResult = {
	knobOffsetX: number;
	knobOffsetY: number;
	hasMovement: boolean;
	velocity: Vector3Tuple;
};

export const resolveJoystickVector = ({
	deltaX,
	deltaY,
	maxRadiusPx,
	deadZoneRatio,
}: ResolveJoystickVectorInput): JoystickVectorResult => {
	const distance = Math.hypot(deltaX, deltaY);

	if (distance === 0) {
		return {
			knobOffsetX: 0,
			knobOffsetY: 0,
			hasMovement: false,
			velocity: [0, 0, 0],
		};
	}

	const boundedDistance = Math.min(distance, maxRadiusPx);
	const unitX = deltaX / distance;
	const unitY = deltaY / distance;
	const knobOffsetX = unitX * boundedDistance;
	const knobOffsetY = unitY * boundedDistance;
	const normalizedX = knobOffsetX / maxRadiusPx;
	const normalizedZ = knobOffsetY / maxRadiusPx;
	const magnitude = Math.hypot(normalizedX, normalizedZ);

	if (magnitude < deadZoneRatio) {
		return {
			knobOffsetX,
			knobOffsetY,
			hasMovement: false,
			velocity: [0, 0, 0],
		};
	}

	return {
		knobOffsetX,
		knobOffsetY,
		hasMovement: true,
		velocity: [normalizedX, 0, normalizedZ],
	};
};

export type { JoystickVectorResult, ResolveJoystickVectorInput };
