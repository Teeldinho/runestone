import { EASING_COEFFICIENTS } from "@/shared/config";

export function easeInOutCubic(progress: number) {
	if (progress < EASING_COEFFICIENTS.HALF_PROGRESS) {
		return (
			EASING_COEFFICIENTS.QUADRUPLE_FACTOR *
			progress ** EASING_COEFFICIENTS.CUBIC_EXPONENT
		);
	}

	const mirroredProgress =
		-EASING_COEFFICIENTS.DOUBLE_FACTOR * progress +
		EASING_COEFFICIENTS.DOUBLE_FACTOR;
	return (
		EASING_COEFFICIENTS.END_PROGRESS -
		mirroredProgress ** EASING_COEFFICIENTS.CUBIC_EXPONENT /
			EASING_COEFFICIENTS.DOUBLE_FACTOR
	);
}

export function lerpNumber(start: number, end: number, progress: number) {
	return start + (end - start) * progress;
}
