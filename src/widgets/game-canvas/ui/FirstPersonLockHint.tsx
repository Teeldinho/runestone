import type { CameraMode } from "@/features/camera-system";

import { GAME_CANVAS_COPY } from "../config";
import { useFirstPersonLockHint } from "../model";

type FirstPersonLockHintProps = {
	cameraMode: CameraMode;
};

export function FirstPersonLockHint({ cameraMode }: FirstPersonLockHintProps) {
	const shouldShowFirstPersonLockHint = useFirstPersonLockHint({
		mode: cameraMode,
	});

	if (!shouldShowFirstPersonLockHint) {
		return null;
	}

	return (
		<div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center px-4">
			<div className="rounded-full border border-panel-border bg-panel/90 px-4 py-2 text-center text-xs font-semibold text-panel-title shadow-lg backdrop-blur-md">
				{GAME_CANVAS_COPY.FIRST_PERSON_LOCK_HINT}
			</div>
		</div>
	);
}

export type { FirstPersonLockHintProps };
