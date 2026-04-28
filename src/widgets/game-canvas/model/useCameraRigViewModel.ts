import { useThree } from "@react-three/fiber";

import type { CameraStateSnapshot } from "@/features/camera-system";
import {
	selectLastTransition,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/lib";
import { createCameraRigFirstPersonBindings } from "../lib/createCameraRigFirstPersonBindings";
import { createCameraRigOrbitBindings } from "../lib/createCameraRigOrbitBindings";
import type { UseCameraRigViewModelResult } from "./cameraRigViewModelTypes";
import { useCameraRigFrameUpdate } from "./useCameraRigFrameUpdate";
import { useCameraRigInteractionHandlers } from "./useCameraRigInteractionHandlers";
import { useCameraRigModeSync } from "./useCameraRigModeSync";
import { useCameraRigRuntimeState } from "./useCameraRigRuntimeState";

type UseCameraRigViewModelInput = {
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot?: CameraStateSnapshot;
	firstPersonLookElement?: HTMLElement | null;
	playerSpawnPosition: Vector3Tuple;
};

export const useCameraRigViewModel = ({
	cameraControlElement,
	cameraStateSnapshot,
	firstPersonLookElement,
	playerSpawnPosition,
}: UseCameraRigViewModelInput): UseCameraRigViewModelResult => {
	const { camera } = useThree();
	const lastTransition = useGameMachineSelector(selectLastTransition);
	const mode = cameraStateSnapshot?.mode;
	const {
		interaction,
		isDesktopLayout,
		previousModeRef,
		previousTrackedPlayerPositionRef,
		refs,
		syncFlags,
		vectors,
	} = useCameraRigRuntimeState();

	useCameraRigModeSync({
		mode,
		needsFirstPersonSyncRef: syncFlags.needsFirstPersonSyncRef,
		needsFreeOrbitalSyncRef: syncFlags.needsFreeOrbitalSyncRef,
		needsThirdPersonSyncRef: syncFlags.needsThirdPersonSyncRef,
		needsTopDownSyncRef: syncFlags.needsTopDownSyncRef,
	});

	const {
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
	} = useCameraRigInteractionHandlers({
		cameraControlElement,
		activeTouchPointerIdsRef: interaction.activeTouchPointerIdsRef,
		firstPersonOrbitRef: refs.firstPersonOrbitRef,
		freeOrbitalOrbitRef: refs.freeOrbitalOrbitRef,
		isTouchInitiallyOnLeftRef: interaction.isTouchInitiallyOnLeftRef,
		isUserInteractingRef: interaction.isUserInteractingRef,
		thirdPersonOrbitRef: refs.thirdPersonOrbitRef,
		topDownOrbitRef: refs.topDownOrbitRef,
	});

	useCameraRigFrameUpdate({
		camera,
		cameraStateSnapshot,
		directionRef: vectors.directionRef,
		firstPersonOrbitRef: refs.firstPersonOrbitRef,
		firstPersonTargetVectorRef: vectors.firstPersonTargetVectorRef,
		freeOrbitalOrbitRef: refs.freeOrbitalOrbitRef,
		isDesktopLayout,
		isUserInteractingRef: interaction.isUserInteractingRef,
		lastTransition,
		lookAtVectorRef: vectors.lookAtVectorRef,
		needsFirstPersonSyncRef: syncFlags.needsFirstPersonSyncRef,
		needsFreeOrbitalSyncRef: syncFlags.needsFreeOrbitalSyncRef,
		needsThirdPersonSyncRef: syncFlags.needsThirdPersonSyncRef,
		needsTopDownSyncRef: syncFlags.needsTopDownSyncRef,
		pointerLockRef: refs.pointerLockRef,
		playerSpawnPosition,
		positionVectorRef: vectors.positionVectorRef,
		previousModeRef,
		previousTrackedPlayerPositionRef,
		thirdPersonOrbitRef: refs.thirdPersonOrbitRef,
		topDownOrbitRef: refs.topDownOrbitRef,
	});

	const sharedOrbitBindings = createCameraRigOrbitBindings({
		cameraControlElement,
		handleOrbitEnd,
		handleOrbitStart,
	});
	const firstPersonBindings = createCameraRigFirstPersonBindings({
		firstPersonLookElement,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
	});

	return {
		firstPersonBindings,
		isDesktopLayout,
		mode,
		orbitBindings: {
			freeOrbital: sharedOrbitBindings,
			thirdPerson: sharedOrbitBindings,
			topDown: sharedOrbitBindings,
		},
		refs,
	};
};

export type { UseCameraRigViewModelInput };
