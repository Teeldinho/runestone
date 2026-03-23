import type { Vector3Tuple } from "@/shared/types";

export const resolvePlayerPosition = (
	_event: { position?: Vector3Tuple },
	_fallback: Vector3Tuple,
): Vector3Tuple => {
	throw new Error("Not implemented");
};
