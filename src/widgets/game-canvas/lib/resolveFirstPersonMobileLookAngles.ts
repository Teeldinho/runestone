import { CAMERA_RIG_FIRST_PERSON_MOBILE_LOOK_LERP_ALPHA } from "../config";

type ResolveFirstPersonMobileLookAnglesInput = {
	readonly currentPitch: number;
	readonly currentYaw: number;
	readonly targetPitch: number;
	readonly targetYaw: number;
};

export type FirstPersonMobileLookAngles = {
	readonly pitch: number;
	readonly yaw: number;
};

const lerpNumber = ({
	current,
	target,
}: {
	readonly current: number;
	readonly target: number;
}): number =>
	current + (target - current) * CAMERA_RIG_FIRST_PERSON_MOBILE_LOOK_LERP_ALPHA;

export const resolveFirstPersonMobileLookAngles = ({
	currentPitch,
	currentYaw,
	targetPitch,
	targetYaw,
}: ResolveFirstPersonMobileLookAnglesInput): FirstPersonMobileLookAngles => ({
	pitch: lerpNumber({
		current: currentPitch,
		target: targetPitch,
	}),
	yaw: lerpNumber({
		current: currentYaw,
		target: targetYaw,
	}),
});
