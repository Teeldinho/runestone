import type { Vector3Tuple } from "@/shared/types";

export const resolvePlayerPosition = (
	event: { position?: Vector3Tuple },
	fallback: Vector3Tuple,
): Vector3Tuple => event.position ?? fallback;
