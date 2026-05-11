import { useMemo } from "react";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { CAMERA_MODES } from "@/features/camera-system";
import type { useTouchLookInput } from "@/features/input-orchestrator";

type TouchLookHandlers = ReturnType<typeof useTouchLookInput>;

type UseGamePageMobileCameraControlHandlersInput = {
	readonly cameraStateSnapshot: CameraStateSnapshot;
	readonly touchLook: TouchLookHandlers;
};

export const useGamePageMobileCameraControlHandlers = ({
	cameraStateSnapshot,
	touchLook,
}: UseGamePageMobileCameraControlHandlersInput) => {
	return useMemo(() => {
		if (cameraStateSnapshot.mode !== CAMERA_MODES.FIRST_PERSON) {
			return {
				onLookPointerDown: undefined,
				onLookPointerMove: undefined,
				onLookPointerUp: undefined,
				onLookPointerCancel: undefined,
			};
		}

		return {
			onLookPointerDown: touchLook.handlePointerDown,
			onLookPointerMove: touchLook.handlePointerMove,
			onLookPointerUp: touchLook.handlePointerUp,
			onLookPointerCancel: touchLook.handlePointerCancel,
		};
	}, [cameraStateSnapshot.mode, touchLook]);
};
