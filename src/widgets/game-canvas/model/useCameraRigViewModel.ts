import { useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useRef } from "react";
import * as THREE from "three";
import type { CameraStateSnapshot } from "@/features/camera-system";
import {
	selectLastTransition,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
import type { Vector3Tuple } from "@/shared/lib";
import type { OrbitControlsHandle } from "../lib";

import { useCameraRigFrameUpdate } from "./useCameraRigFrameUpdate";
import { useCameraRigInteractionHandlers } from "./useCameraRigInteractionHandlers";
import { useCameraRigModeSync } from "./useCameraRigModeSync";

type PointerLockControlsHandle = {
	isLocked: boolean;
};

type UseCameraRigViewModelInput = {
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot?: CameraStateSnapshot;
	playerSpawnPosition: Vector3Tuple;
};

type UseCameraRigViewModelResult = {
	controlKey: string | undefined;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitStart: () => void;
	handleOrbitEnd: () => void;
	mode: CameraStateSnapshot["mode"] | undefined;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	isDesktopLayout: boolean;
};

export const useCameraRigViewModel = ({
	cameraControlElement,
	cameraStateSnapshot,
	playerSpawnPosition,
}: UseCameraRigViewModelInput): UseCameraRigViewModelResult => {
	const { camera } = useThree();
	const lastTransition = useGameMachineSelector(selectLastTransition);
	const mode = cameraStateSnapshot?.mode;
	const previousModeRef = useRef<string | undefined>(undefined);
	const pointerLockRef = useRef<PointerLockControlsHandle>(null);
	const thirdPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const topDownOrbitRef = useRef<OrbitControlsHandle>(null);
	const freeOrbitalOrbitRef = useRef<OrbitControlsHandle>(null);
	const firstPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const { isDesktopLayout } = useResponsiveGameLayout();
	const needsFreeOrbitalSyncRef = useRef(false);
	const needsThirdPersonSyncRef = useRef(false);
	const needsTopDownSyncRef = useRef(false);
	const needsFirstPersonSyncRef = useRef(false);
	const isUserInteractingRef = useRef(false);
	const previousTrackedPlayerPositionRef = useRef<Vector3Tuple | null>(null);
	const directionRef = useRef(new THREE.Vector3());
	const lookAtVectorRef = useRef(new THREE.Vector3());
	const positionVectorRef = useRef(new THREE.Vector3());
	const firstPersonTargetVectorRef = useRef(new THREE.Vector3());
	const isTouchInitiallyOnLeftRef = useRef(false);

	useCameraRigModeSync({
		mode,
		needsFirstPersonSyncRef,
		needsFreeOrbitalSyncRef,
		needsThirdPersonSyncRef,
		needsTopDownSyncRef,
	});

	const {
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
	} = useCameraRigInteractionHandlers({
		cameraControlElement,
		firstPersonOrbitRef,
		freeOrbitalOrbitRef,
		isTouchInitiallyOnLeftRef,
		isUserInteractingRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
	});

	useCameraRigFrameUpdate({
		camera,
		cameraStateSnapshot,
		directionRef,
		firstPersonOrbitRef,
		firstPersonTargetVectorRef,
		freeOrbitalOrbitRef,
		isDesktopLayout,
		isUserInteractingRef,
		lastTransition,
		lookAtVectorRef,
		needsFirstPersonSyncRef,
		needsFreeOrbitalSyncRef,
		needsThirdPersonSyncRef,
		needsTopDownSyncRef,
		pointerLockRef,
		playerSpawnPosition,
		positionVectorRef,
		previousModeRef,
		previousTrackedPlayerPositionRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
	});

	return {
		controlKey: cameraStateSnapshot?.mode,
		freeOrbitalOrbitRef,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
		mode,
		pointerLockRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
		firstPersonOrbitRef,
		isDesktopLayout,
	};
};

export type {
	OrbitControlsHandle,
	PointerLockControlsHandle,
	UseCameraRigViewModelInput,
	UseCameraRigViewModelResult,
};
