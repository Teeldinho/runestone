import * as THREE from "three";
import { CAMERA_TRANSITION_MS } from "@/shared/config";
import {
	computeCameraRigLerpAlpha,
	computeCameraRigTransitionJumpDistance,
} from "../lib/cameraMath";

export const CAMERA_RIG_LERP_ALPHA =
	computeCameraRigLerpAlpha(CAMERA_TRANSITION_MS);

export const CAMERA_RIG_TRANSITION_JUMP_DISTANCE =
	computeCameraRigTransitionJumpDistance();

export const CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING = 0.2;

export const CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE =
	CAMERA_RIG_TRANSITION_JUMP_DISTANCE;

export const CAMERA_RIG_CAMERA_UP = {
	DEFAULT: [0, 1, 0],
	TOP_DOWN: [0, 0, 1],
} as const;

export const CAMERA_RIG_TOUCH_GESTURES = {
	ORBIT: {
		ONE: THREE.TOUCH.ROTATE,
		TWO: THREE.TOUCH.DOLLY_PAN,
	},
	TOP_DOWN: {
		ONE: THREE.TOUCH.PAN,
		TWO: THREE.TOUCH.DOLLY_PAN,
	},
} as const;
