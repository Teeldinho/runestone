import { DOOR_SIDES, type DoorSide } from "@/entities/dungeon";
import { CAMERA_MODES, type CameraMode } from "@/features/camera-system";
import { DOORWAY_NAVIGATION_CONFIG } from "@/features/dungeon-navigation";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import {
	CAMERA_RIG_MOBILE_FREE_ORBITAL_OFFSET_SCALE,
	CAMERA_RIG_MOBILE_TOP_DOWN_HEIGHT_SCALE,
	CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING,
} from "../config";

type GetCameraRigTargetsInput = {
	mode: CameraMode;
	playerPosition: Vector3Tuple;
	isDesktopLayout?: boolean;
};

type CameraRigTargets = {
	lookAt: Vector3Tuple;
	position: Vector3Tuple;
};

type GetThirdPersonTransitionTargetsInput = {
	doorSide: DoorSide;
	playerPosition: Vector3Tuple;
};

const getThirdPersonTransitionOffset = (doorSide: DoorSide): Vector3Tuple => {
	const [, offsetY] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;
	const transitionDistance = Math.max(
		DOORWAY_NAVIGATION_CONFIG.ARRIVAL_OFFSET -
			CAMERA_RIG_THIRD_PERSON_TRANSITION_PADDING,
		0,
	);

	if (doorSide === DOOR_SIDES.NORTH) {
		return [0, offsetY, -transitionDistance];
	}

	if (doorSide === DOOR_SIDES.SOUTH) {
		return [0, offsetY, transitionDistance];
	}

	if (doorSide === DOOR_SIDES.EAST) {
		return [transitionDistance, offsetY, 0];
	}

	return [-transitionDistance, offsetY, 0];
};

export const getCameraRigTargets = ({
	mode,
	playerPosition,
	isDesktopLayout = true,
}: GetCameraRigTargetsInput): CameraRigTargets => {
	const [px, py, pz] = playerPosition;

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return {
			position: [px, py + PLAYER_EYE_HEIGHT, pz],
			lookAt: [px, py + PLAYER_EYE_HEIGHT, pz + 1],
		};
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;

		return {
			position: [px + ox, py + oy, pz + oz],
			lookAt: [px, py + PLAYER_EYE_HEIGHT, pz],
		};
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		// Zoom in slightly on mobile by reducing the default height
		const defaultHeight = CAMERA_CONFIG.TOP_DOWN.HEIGHT;
		const finalHeight = isDesktopLayout
			? defaultHeight
			: defaultHeight * CAMERA_RIG_MOBILE_TOP_DOWN_HEIGHT_SCALE;

		return {
			position: [px, finalHeight, pz],
			lookAt: [px, py, pz],
		};
	}

	// FREE_ORBITAL logic
	const [ox, oy, oz] = CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION;

	// Zoom in slightly on mobile by scaling down the initial offset
	const mobileScale = CAMERA_RIG_MOBILE_FREE_ORBITAL_OFFSET_SCALE;

	const finalOx = isDesktopLayout ? ox : ox * mobileScale;
	const finalOy = isDesktopLayout ? oy : oy * mobileScale;
	const finalOz = isDesktopLayout ? oz : oz * mobileScale;

	return {
		position: [px + finalOx, py + finalOy, pz + finalOz],
		lookAt: [px, py + CAMERA_CONFIG.FREE_ORBITAL.TARGET_OFFSET_Y, pz],
	};
};

export const getThirdPersonTransitionTargets = ({
	doorSide,
	playerPosition,
}: GetThirdPersonTransitionTargetsInput): CameraRigTargets => {
	const [px, py, pz] = playerPosition;
	const [offsetX, offsetY, offsetZ] = getThirdPersonTransitionOffset(doorSide);

	return {
		position: [px + offsetX, py + offsetY, pz + offsetZ],
		lookAt: [px, py + PLAYER_EYE_HEIGHT, pz],
	};
};

export type {
	CameraRigTargets,
	GetCameraRigTargetsInput,
	GetThirdPersonTransitionTargetsInput,
};
