type ClampCameraControlsPolarAngleInput = {
	readonly polarAngle: number;
	readonly minPolarAngle: number;
	readonly maxPolarAngle: number;
};

export const clampCameraControlsPolarAngle = ({
	polarAngle,
	minPolarAngle,
	maxPolarAngle,
}: ClampCameraControlsPolarAngleInput): number =>
	Math.min(Math.max(polarAngle, minPolarAngle), maxPolarAngle);

export type { ClampCameraControlsPolarAngleInput };
