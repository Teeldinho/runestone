import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

import { CAMERA_MODES, useCameraMachine } from "@/features/camera-system";
import { CAMERA_CONFIG } from "@/shared/config";
import { setCameraAzimuth } from "@/shared/lib/cameraOrientationStore";
import { getPlayerPosition } from "@/shared/lib/playerPositionStore";

export function CameraRig() {
	const { camera } = useThree();
	const perspCamera = camera as THREE.PerspectiveCamera;

	const { mode, cameraStateSnapshot } = useCameraMachine();

	const prevModeRef = useRef<string | null>(null);
	const isModeChange = mode !== prevModeRef.current;

	// Refs for controls
	const orbitControlsRef =
		useRef<React.ComponentRef<typeof OrbitControls>>(null);
	const pointerLockRef =
		useRef<React.ComponentRef<typeof PointerLockControls>>(null);

	// Track player position for orbit controls target
	useFrame(() => {
		const [px, py, pz] = getPlayerPosition();

		// Write camera azimuth for player-relative movement
		const dir = new THREE.Vector3();
		camera.getWorldDirection(dir);
		dir.y = 0;
		if (dir.lengthSq() > 0) {
			setCameraAzimuth(Math.atan2(dir.x, dir.z));
		}

		// Handle mode-specific logic
		switch (mode) {
			case CAMERA_MODES.THIRD_PERSON: {
				// Orbit controls track player
				if (orbitControlsRef.current) {
					orbitControlsRef.current.target.set(px, py + 1, pz);
					orbitControlsRef.current.update();
				}
				break;
			}
			case CAMERA_MODES.TOP_DOWN: {
				// Position camera above player, looking straight down
				if (isModeChange) {
					camera.position.set(
						px,
						CAMERA_CONFIG.TOP_DOWN.HEIGHT,
						pz + CAMERA_CONFIG.TOP_DOWN.DISTANCE,
					);
					camera.up.set(0, 0, -1); // Rotate view to horizontal orientation
				}
				camera.lookAt(px, 0, pz);
				break;
			}
			case CAMERA_MODES.FIRST_PERSON: {
				// Position camera at player eye level
				const eyeHeight = py + 1.7;
				if (isModeChange) {
					camera.position.set(px, eyeHeight, pz);
				}
				break;
			}
			case CAMERA_MODES.FREE_ORBITAL: {
				// Orbit controls at fixed position
				if (orbitControlsRef.current) {
					orbitControlsRef.current.target.set(0, 0, 0);
					orbitControlsRef.current.update();
				}
				break;
			}
			default:
				break;
		}

		// Update FOV based on mode
		const targetFov = cameraStateSnapshot.fov;
		if (Math.abs(perspCamera.fov - targetFov) > 0.01) {
			perspCamera.fov += (targetFov - perspCamera.fov) * 0.1;
			perspCamera.updateProjectionMatrix();
		}

		// Update prevModeRef after processing
		if (isModeChange) {
			prevModeRef.current = mode;
		}
	});

	// Handle pointer lock for first person
	const handleFirstPersonLock = useCallback(() => {
		// Pointer locked - no action needed
	}, []);

	const handleFirstPersonUnlock = useCallback(() => {
		// Pointer unlocked - no action needed
	}, []);

	// Reset camera on mode change
	useEffect(() => {
		if (isModeChange) {
			const [px, py, pz] = getPlayerPosition();

			switch (mode) {
				case CAMERA_MODES.THIRD_PERSON: {
					const [ox, oy, oz] = CAMERA_CONFIG.THIRD_PERSON.OFFSET;
					camera.position.set(px + ox, py + oy, pz + oz);
					break;
				}
				case CAMERA_MODES.TOP_DOWN: {
					camera.position.set(
						px,
						CAMERA_CONFIG.TOP_DOWN.HEIGHT,
						pz + CAMERA_CONFIG.TOP_DOWN.DISTANCE,
					);
					camera.up.set(0, 0, -1);
					break;
				}
				case CAMERA_MODES.FIRST_PERSON: {
					camera.position.set(px, py + 1.7, pz);
					break;
				}
				case CAMERA_MODES.FREE_ORBITAL: {
					const [ix, iy, iz] = CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION;
					camera.position.set(ix, iy, iz);
					camera.up.set(0, 1, 0);
					break;
				}
				default:
					break;
			}
		}
	}, [mode, isModeChange, camera]);

	// Render appropriate controls based on mode
	if (mode === CAMERA_MODES.FREE_ORBITAL) {
		return (
			<OrbitControls
				ref={orbitControlsRef}
				makeDefault
				enablePan
				maxDistance={CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE}
				maxPolarAngle={CAMERA_CONFIG.FREE_ORBITAL.MAX_POLAR_ANGLE}
				minDistance={CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE}
				minPolarAngle={CAMERA_CONFIG.FREE_ORBITAL.MIN_POLAR_ANGLE}
				target={[0, 0, 0]}
			/>
		);
	}

	if (mode === CAMERA_MODES.THIRD_PERSON) {
		return (
			<OrbitControls
				ref={orbitControlsRef}
				makeDefault
				enablePan
				enableZoom
				enableRotate
				maxDistance={12}
				minDistance={3}
				maxPolarAngle={Math.PI * 0.48}
				minPolarAngle={0.2}
			/>
		);
	}

	if (mode === CAMERA_MODES.TOP_DOWN) {
		return (
			<OrbitControls
				ref={orbitControlsRef}
				makeDefault
				enableRotate={false}
				enablePan
				enableZoom
				maxDistance={45}
				minDistance={20}
			/>
		);
	}

	if (mode === CAMERA_MODES.FIRST_PERSON) {
		return (
			<PointerLockControls
				ref={pointerLockRef}
				selector="#game-canvas-fp-lock"
				onLock={handleFirstPersonLock}
				onUnlock={handleFirstPersonUnlock}
			/>
		);
	}

	return null;
}
