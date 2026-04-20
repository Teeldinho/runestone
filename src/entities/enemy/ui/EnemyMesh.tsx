import { useGLTF } from "@react-three/drei";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";

import type { Vector3Tuple } from "@/shared/lib";
import { getPlayerPosition } from "@/shared/lib";

import {
	ENEMY_ANIMATION_PATHS,
	ENEMY_ENTITY_CONFIG,
	ENEMY_GLTF_CONFIG,
} from "../config";
import {
	useEnemyGltfResources,
	useEnemyMeshViewModel,
	useEnemyMovement,
	useEnemyPhysicsLoop,
} from "../model";

useGLTF.preload(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
useGLTF.preload(ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC);
useGLTF.preload(ENEMY_ANIMATION_PATHS.GENERAL);
useGLTF.preload(ENEMY_ANIMATION_PATHS.COMBAT_MELEE);

type EnemyMeshProps = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	patrolCenter: Vector3Tuple;
	onDead: () => void;
	onAttack: () => void;
};

export function EnemyMesh({
	id,
	roomId,
	position,
	patrolCenter,
	onDead,
	onAttack,
}: EnemyMeshProps) {
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
