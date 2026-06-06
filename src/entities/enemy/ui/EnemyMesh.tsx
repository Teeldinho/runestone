import { useGLTF } from "@react-three/drei";
import type { RapierRigidBody } from "@react-three/rapier";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";
import { getPlayerPosition, preloadGltfAssets } from "@/shared/lib";

import {
	ENEMY_ANIMATION_PATHS,
	ENEMY_ENTITY_CONFIG,
	ENEMY_GLTF_CONFIG,
} from "../config";
import type { EnemyMeshActions, EnemyMeshSettings } from "../model";
import {
	useEnemyGltfResources,
	useEnemyMeshViewModel,
	useEnemyMovement,
	useEnemyPhysicsLoop,
} from "../model";

preloadGltfAssets(useGLTF, [
	ENEMY_GLTF_CONFIG.CHARACTER.PATH,
	ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC,
	ENEMY_ANIMATION_PATHS.GENERAL,
	ENEMY_ANIMATION_PATHS.COMBAT_MELEE,
]);

type EnemyMeshProps = {
	settings: EnemyMeshSettings;
	actions: EnemyMeshActions;
};

export function EnemyMesh({ settings, actions }: EnemyMeshProps) {
	const { id, patrolCenter, position, roomId } = settings;
	const { onAttack, onDead } = actions;
	const rigidBodyRef = useRef<RapierRigidBody>(null);

	const { glowSettings, animationName, behaviorState, send } =
		useEnemyMeshViewModel({
			id,
			roomId,
			position,
			onDead,
			onAttack,
		});

	const { getNextPosition } = useEnemyMovement({
		behaviorState,
		getPlayerPosition,
		patrolCenter,
	});

	useEnemyPhysicsLoop({
		rigidBodyRef,
		id,
		position,
		send,
		getNextPosition,
	});

	const { clonedScene, groupRef } = useEnemyGltfResources(animationName);

	return (
		<RigidBody
			ref={rigidBodyRef as RefObject<RapierRigidBody>}
			colliders={false}
			linearDamping={ENEMY_ENTITY_CONFIG.PHYSICS.LINEAR_DAMPING}
			lockRotations
			position={position}
			type="dynamic"
		>
			<CapsuleCollider
				args={[
					ENEMY_ENTITY_CONFIG.COLLIDER.HALF_HEIGHT,
					ENEMY_ENTITY_CONFIG.COLLIDER.RADIUS,
				]}
			/>
			<group ref={groupRef}>
				<primitive
					frustumCulled={false}
					object={clonedScene}
					position={[0, ENEMY_GLTF_CONFIG.CHARACTER.POSITION_Y, 0]}
					scale={ENEMY_GLTF_CONFIG.CHARACTER.SCALE}
				/>
				<mesh
					position={[0, ENEMY_ENTITY_CONFIG.GLOW.OFFSET_Y, 0]}
					rotation={[ENEMY_ENTITY_CONFIG.GLOW.ROTATION_X_RAD, 0, 0]}
				>
					<torusGeometry
						args={[
							ENEMY_ENTITY_CONFIG.GLOW.RADIUS,
							ENEMY_ENTITY_CONFIG.GLOW.TUBE_RADIUS,
							ENEMY_ENTITY_CONFIG.GLOW.RADIAL_SEGMENTS,
							ENEMY_ENTITY_CONFIG.GLOW.TUBULAR_SEGMENTS,
						]}
					/>
					<meshStandardMaterial
						color={glowSettings.color}
						emissive={glowSettings.color}
						emissiveIntensity={glowSettings.emissiveIntensity}
						opacity={ENEMY_ENTITY_CONFIG.GLOW.MATERIAL_OPACITY}
						transparent
					/>
				</mesh>
			</group>
		</RigidBody>
	);
}
