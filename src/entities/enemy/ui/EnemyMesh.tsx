import type { RapierRigidBody } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useRef } from "react";

import type { Vector3Tuple } from "@/shared/types";

import { ENEMY_ENTITY_CONFIG } from "../config";
import { useEnemyMeshViewModel } from "../model/useEnemyMeshViewModel";

type EnemyMeshProps = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	playerPosition: Vector3Tuple;
	onDead: () => void;
};

export function EnemyMesh({
	id,
	roomId,
	position,
	playerPosition,
	onDead,
}: EnemyMeshProps) {
	const rigidBodyRef = useRef<RapierRigidBody>(null);

	const { glowSettings } = useEnemyMeshViewModel({
		id,
		roomId,
		position,
		playerPosition,
		onDead,
	});

	return (
		<RigidBody
			ref={rigidBodyRef as RefObject<RapierRigidBody>}
			colliders="hull"
			position={position}
			type="kinematicPosition"
		>
			<mesh castShadow position={[0, ENEMY_ENTITY_CONFIG.BODY.POSITION_Y, 0]}>
				<cylinderGeometry
					args={[
						ENEMY_ENTITY_CONFIG.BODY.RADIUS,
						ENEMY_ENTITY_CONFIG.BODY.RADIUS,
						ENEMY_ENTITY_CONFIG.BODY.HEIGHT,
						ENEMY_ENTITY_CONFIG.BODY.RADIAL_SEGMENTS,
					]}
				/>
				<meshStandardMaterial
					color={ENEMY_ENTITY_CONFIG.BODY.COLOR}
					metalness={ENEMY_ENTITY_CONFIG.BODY.METALNESS}
					roughness={ENEMY_ENTITY_CONFIG.BODY.ROUGHNESS}
				/>
			</mesh>

			<mesh castShadow position={[0, ENEMY_ENTITY_CONFIG.HEAD.OFFSET_Y, 0]}>
				<sphereGeometry
					args={[
						ENEMY_ENTITY_CONFIG.HEAD.RADIUS,
						ENEMY_ENTITY_CONFIG.HEAD.WIDTH_SEGMENTS,
						ENEMY_ENTITY_CONFIG.HEAD.HEIGHT_SEGMENTS,
					]}
				/>
				<meshStandardMaterial color={ENEMY_ENTITY_CONFIG.HEAD.COLOR} />
			</mesh>

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
		</RigidBody>
	);
}
