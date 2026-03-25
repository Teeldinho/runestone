import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { PLAYER_STATES } from "../config";
import { selectPlayerAnimation } from "../lib";
import { usePlayerMachineRuntime } from "./playerMachineRuntime";
import type { PlayerHealthState, PlayerMeshSettings } from "./types";
import { usePlayerMesh } from "./usePlayerMesh";
import { usePlayerPhysics } from "./usePlayerPhysics";

type UsePlayerMeshViewModelResult = {
	meshSettings: PlayerMeshSettings;
	rigidBodyRef: RefObject<RapierRigidBody | null>;
	animationName: string;
};

export const usePlayerMeshViewModel = (): UsePlayerMeshViewModelResult => {
	const { snapshot } = usePlayerMachineRuntime();
	const healthState = snapshot.value[
		PLAYER_STATES.REGIONS.HEALTH
	] as PlayerHealthState;
	const meshSettings = usePlayerMesh({ healthState });
	const { rigidBodyRef } = usePlayerPhysics({
		position: snapshot.context.position,
		velocity: snapshot.context.velocity,
		isSprinting: snapshot.context.isSprinting,
	});
	const animationName = selectPlayerAnimation(
		snapshot.context.velocity,
		snapshot.context.isSprinting,
		healthState,
	);
	return { meshSettings, rigidBodyRef, animationName };
};
