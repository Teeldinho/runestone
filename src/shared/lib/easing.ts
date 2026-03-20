const HALF_PROGRESS = 0.5;
const DOUBLE_FACTOR = 2;
const QUADRUPLE_FACTOR = 4;
const CUBIC_EXPONENT = 3;
const END_PROGRESS = 1;

export function easeInOutCubic(progress: number) {
	if (progress < HALF_PROGRESS) {
		return QUADRUPLE_FACTOR * progress ** CUBIC_EXPONENT;
	}

	const mirroredProgress = -DOUBLE_FACTOR * progress + DOUBLE_FACTOR;
	return END_PROGRESS - mirroredProgress ** CUBIC_EXPONENT / DOUBLE_FACTOR;
}

export function lerpNumber(start: number, end: number, progress: number) {
	return start + (end - start) * progress;
}
