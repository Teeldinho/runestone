import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef, useSyncExternalStore } from "react";
import type { Vector3Tuple } from "@/shared/lib";
import { getCameraMode, subscribeToCameraMode } from "@/shared/lib";
import { PLAYER_STATES } from "../config";
import { resolvePlayerAvatarVisibility, selectPlayerAnimation } from "../lib";
import { usePlayerMachineRuntime } from "./playerMachineRuntime";
import type { PlayerHealthState, PlayerMeshSettings } from "./types";
import { usePlayerMesh } from "./usePlayerMesh";
import { usePlayerPhysics } from "./usePlayerPhysics";

type UsePlayerMeshViewModelInput = {
	initialPosition?: Vector3Tuple;
};

type UsePlayerMeshViewModelResult = {
	isAuraVisible: boolean;
	isAvatarVisible: boolean;
	meshSettings: PlayerMeshSettings;
	rigidBodyRef: RefObject<RapierRigidBody | null>;
	animationName: string;
};

export const usePlayerMeshViewModel = ({
	initialPosition,
}: UsePlayerMeshViewModelInput = {}): UsePlayerMeshViewModelResult => {
	const initialPositionRef = useRef(initialPosition);
	if (!initialPositionRef.current && initialPosition) {
		initialPositionRef.current = initialPosition;
	}

	const { snapshot } = usePlayerMachineRuntime();
	const healthState = snapshot.value[
		PLAYER_STATES.REGIONS.HEALTH
	] as PlayerHealthState;
	const meshSettings = usePlayerMesh({
		healthState,
		position: initialPositionRef.current,
	});
	const { rigidBodyRef } = usePlayerPhysics({
		velocity: snapshot.context.velocity,
		isSprinting: snapshot.context.isSprinting,
	});
	const cameraMode = useSyncExternalStore(
		subscribeToCameraMode,
		getCameraMode,
		getCameraMode,
	);
	const { isAuraVisible, isAvatarVisible } = resolvePlayerAvatarVisibility({
		cameraMode,
	});
	const animationName = selectPlayerAnimation(
		snapshot.context.velocity,
		snapshot.context.isSprinting,
		healthState,
	);
	return {
		isAuraVisible,
		isAvatarVisible,
		meshSettings,
		rigidBodyRef,
		animationName,
	};
};
