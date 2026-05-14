import type { MutableRefObject, RefObject } from "react";
import type * as THREE from "three";

import type { CameraStateSnapshot } from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";

import type { OrbitControlsHandle } from "../lib";

import type { PointerLockControlsHandle } from "./useCameraRigFrameUpdate";

type CameraRigOrbitBindings = {
	domElement?: HTMLElement;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
	shouldRenderOrbitControls: boolean;
};

type CameraRigFirstPersonBindings = {
	firstPersonLookElement?: HTMLElement | null;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitEnd: () => void;
	handleOrbitStart: () => void;
};

type CameraRigRefs = {
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
};

type CameraRigRuntimeState = {
	interaction: {
		isUserInteractingRef: MutableRefObject<boolean>;
	};
	isDesktopLayout: boolean;
	previousModeRef: MutableRefObject<string | undefined>;
	previousTrackedPlayerPositionRef: MutableRefObject<Vector3Tuple | null>;
	refs: CameraRigRefs;
	syncFlags: {
		needsFirstPersonSyncRef: MutableRefObject<boolean>;
		needsFreeOrbitalSyncRef: MutableRefObject<boolean>;
		needsThirdPersonSyncRef: MutableRefObject<boolean>;
		needsTopDownSyncRef: MutableRefObject<boolean>;
	};
	vectors: {
		directionRef: MutableRefObject<THREE.Vector3>;
		firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
		lookAtVectorRef: MutableRefObject<THREE.Vector3>;
		positionVectorRef: MutableRefObject<THREE.Vector3>;
	};
};

type UseCameraRigViewModelResult = {
	firstPersonBindings: CameraRigFirstPersonBindings;
	isDesktopLayout: boolean;
	mode: CameraStateSnapshot["mode"] | undefined;
	orbitBindings: {
		freeOrbital: CameraRigOrbitBindings;
		thirdPerson: CameraRigOrbitBindings;
		topDown: CameraRigOrbitBindings;
	};
	refs: CameraRigRefs;
};

export type {
	CameraRigFirstPersonBindings,
	CameraRigOrbitBindings,
	CameraRigRefs,
	CameraRigRuntimeState,
	UseCameraRigViewModelResult,
};
