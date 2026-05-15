import type { CameraControlsProps } from "@react-three/drei/core/CameraControls.js";
import CameraControlsImpl from "camera-controls";

import { CAMERA_MODE_IDS, type CameraModeId } from "../config";

type CameraControlsInputBindings = {
	readonly mouseButtons: NonNullable<CameraControlsProps["mouseButtons"]>;
	readonly touches: NonNullable<CameraControlsProps["touches"]>;
};

export const resolveCameraControlsInputBindings = (
	mode: CameraModeId,
): CameraControlsInputBindings => {
	const { ACTION } = CameraControlsImpl;

	if (mode === CAMERA_MODE_IDS.TOP_DOWN) {
		return {
			mouseButtons: {
				left: ACTION.NONE,
				middle: ACTION.DOLLY,
				right: ACTION.NONE,
				wheel: ACTION.DOLLY,
			},
			touches: {
				one: ACTION.NONE,
				two: ACTION.TOUCH_DOLLY,
				three: ACTION.NONE,
			},
		};
	}

	if (mode === CAMERA_MODE_IDS.FIRST_PERSON) {
		return {
			mouseButtons: {
				left: ACTION.ROTATE,
				middle: ACTION.NONE,
				right: ACTION.NONE,
				wheel: ACTION.NONE,
			},
			touches: {
				one: ACTION.TOUCH_ROTATE,
				two: ACTION.NONE,
				three: ACTION.NONE,
			},
		};
	}

	if (mode === CAMERA_MODE_IDS.FREE_ORBIT) {
		return {
			mouseButtons: {
				left: ACTION.ROTATE,
				middle: ACTION.DOLLY,
				right: ACTION.TRUCK,
				wheel: ACTION.DOLLY,
			},
			touches: {
				one: ACTION.TOUCH_ROTATE,
				two: ACTION.TOUCH_DOLLY_TRUCK,
				three: ACTION.NONE,
			},
		};
	}

	return {
		mouseButtons: {
			left: ACTION.ROTATE,
			middle: ACTION.DOLLY,
			right: ACTION.NONE,
			wheel: ACTION.DOLLY,
		},
		touches: {
			one: ACTION.TOUCH_ROTATE,
			two: ACTION.TOUCH_DOLLY,
			three: ACTION.NONE,
		},
	};
};

export type { CameraControlsInputBindings };
