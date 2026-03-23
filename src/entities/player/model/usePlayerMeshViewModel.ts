import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";

import type { PlayerHealthState, PlayerMeshSettings } from "./types";
import { usePlayerMachineRuntime } from "./playerMachineRuntime";
import { usePlayerMesh } from "./usePlayerMesh";
import { usePlayerPhysics } from "./usePlayerPhysics";

type UsePlayerMeshViewModelResult = {
	meshSettings: PlayerMeshSettings;
	rigidBodyRef: RefObject<RapierRigidBody | null>;
};

export const usePlayerMeshViewModel = (): UsePlayerMeshViewModelResult => {
	const { snapshot } = usePlayerMachineRuntime();
	const healthState = snapshot.value.health as PlayerHealthState;
	const meshSettings = usePlayerMesh({ healthState });
	const { rigidBodyRef } = usePlayerPhysics({
		position: snapshot.context.position,
		velocity: snapshot.context.velocity,
	});
	return { meshSettings, rigidBodyRef };
};
