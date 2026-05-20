import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";
import type { Vector3Tuple } from "@/shared/lib";
import { useResponsiveLayout } from "@/shared/lib";
import { useCameraModeValue } from "@/shared/model";
import { PLAYER_STATES } from "../config";
import {
	resolvePlayerAvatarVisibility,
	resolvePlayerRunningIndicatorVisibility,
	selectPlayerAnimation,
} from "../lib";
import { usePlayerMachineRuntime } from "./playerMachineRuntime";
import type {
	PlayerGroundSensorColliderProps,
	PlayerHealthState,
	PlayerMeshSettings,
	PlayerMovementState,
} from "./types";
import { usePlayerGroundingRuntime } from "./usePlayerGroundingRuntime";
import { usePlayerJumpPhysics } from "./usePlayerJumpPhysics";
import { usePlayerMesh } from "./usePlayerMesh";
import { usePlayerPhysics } from "./usePlayerPhysics";

type UsePlayerMeshViewModelInput = {
	initialPosition?: Vector3Tuple;
};

type UsePlayerMeshViewModelResult = {
	isAvatarVisible: boolean;
	groundSensorColliderProps: PlayerGroundSensorColliderProps;
	isRunningIndicatorVisible: boolean;
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

	const { isDesktopLayout } = useResponsiveLayout();
	const { snapshot, sendPlayerMachineEvent } = usePlayerMachineRuntime();
	const healthState = snapshot.value[
		PLAYER_STATES.REGIONS.HEALTH
	] as PlayerHealthState;
	const movementState = snapshot.value[
		PLAYER_STATES.REGIONS.MOVEMENT
	] as PlayerMovementState;
	const meshSettings = usePlayerMesh({
		position: initialPositionRef.current,
	});
	const { rigidBodyRef } = usePlayerPhysics({
		velocity: snapshot.context.velocity,
		isSprinting: snapshot.context.isSprinting,
	});
	const { groundSensorColliderProps, isGrounded } = usePlayerGroundingRuntime({
		sendPlayerMachineEvent,
	});

	usePlayerJumpPhysics({
		rigidBodyRef,
		wantsJumpImpulse: snapshot.context.wantsJumpImpulse,
		isGrounded,
	});
	const cameraMode = useCameraModeValue();
	const { isAvatarVisible } = resolvePlayerAvatarVisibility({
		cameraMode,
	});
	const isRunningIndicatorVisible = resolvePlayerRunningIndicatorVisibility({
		isAvatarVisible,
		isDesktopLayout,
		movementState,
	});
	const animationName = selectPlayerAnimation(
		snapshot.context.velocity,
		snapshot.context.isSprinting,
		healthState,
	);
	return {
		isAvatarVisible,
		groundSensorColliderProps,
		isRunningIndicatorVisible,
		meshSettings,
		rigidBodyRef,
		animationName,
	};
};
