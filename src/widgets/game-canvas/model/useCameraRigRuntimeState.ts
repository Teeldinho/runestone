import { useRef } from "react";
import * as THREE from "three";

import { useResponsiveGameLayout } from "@/features/responsive-layout";
import type { Vector3Tuple } from "@/shared/lib";

import type { OrbitControlsHandle } from "../lib";

import type { CameraRigRuntimeState } from "./cameraRigViewModelTypes";
import type { PointerLockControlsHandle } from "./useCameraRigFrameUpdate";

export const useCameraRigRuntimeState = (): CameraRigRuntimeState => {
	const pointerLockRef = useRef<PointerLockControlsHandle>(null);
	const thirdPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const topDownOrbitRef = useRef<OrbitControlsHandle>(null);
	const freeOrbitalOrbitRef = useRef<OrbitControlsHandle>(null);
	const firstPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const needsFreeOrbitalSyncRef = useRef(false);
	const needsThirdPersonSyncRef = useRef(false);
	const needsTopDownSyncRef = useRef(false);
	const needsFirstPersonSyncRef = useRef(false);
	const isUserInteractingRef = useRef(false);
	const isTouchInitiallyOnLeftRef = useRef(false);
	const previousTrackedPlayerPositionRef = useRef<Vector3Tuple | null>(null);
	const previousModeRef = useRef<string | undefined>(undefined);
	const directionRef = useRef(new THREE.Vector3());
	const lookAtVectorRef = useRef(new THREE.Vector3());
	const positionVectorRef = useRef(new THREE.Vector3());
	const firstPersonTargetVectorRef = useRef(new THREE.Vector3());
	const { isDesktopLayout } = useResponsiveGameLayout();

	return {
		interaction: {
			isTouchInitiallyOnLeftRef,
			isUserInteractingRef,
		},
		isDesktopLayout,
		previousModeRef,
		previousTrackedPlayerPositionRef,
		refs: {
			firstPersonOrbitRef,
			freeOrbitalOrbitRef,
			pointerLockRef,
			thirdPersonOrbitRef,
			topDownOrbitRef,
		},
		syncFlags: {
			needsFirstPersonSyncRef,
			needsFreeOrbitalSyncRef,
			needsThirdPersonSyncRef,
			needsTopDownSyncRef,
		},
		vectors: {
			directionRef,
			firstPersonTargetVectorRef,
			lookAtVectorRef,
			positionVectorRef,
		},
	};
};
