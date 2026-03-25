import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";

import type { Vector3Tuple } from "@/shared/types";

import {
	ENEMY_ANIMATION_PATHS,
	ENEMY_ENTITY_CONFIG,
	ENEMY_GLTF_CONFIG,
} from "../config";
import { useEnemyMeshViewModel } from "../model/useEnemyMeshViewModel";
import { useEnemyMovement } from "../model/useEnemyMovement";

useGLTF.preload(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
useGLTF.preload(ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC);
useGLTF.preload(ENEMY_ANIMATION_PATHS.GENERAL);
useGLTF.preload(ENEMY_ANIMATION_PATHS.COMBAT_MELEE);

type EnemyMeshProps = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	playerPosition: Vector3Tuple;
	onDead: () => void;
	onAttack: () => void;
};

export function EnemyMesh({
	id,
	roomId,
	position,
	playerPosition,
	onDead,
	onAttack,
}: EnemyMeshProps) {
	const rigidBodyRef = useRef<RapierRigidBody>(null);
	const groupRef = useRef<THREE.Group>(null);

	const { glowSettings, animationName, behaviorState } = useEnemyMeshViewModel({
		id,
		roomId,
		position,
		playerPosition,
		onDead,
		onAttack,
	});

	const { getNextPosition } = useEnemyMovement({
		behaviorState,
		playerPosition,
		patrolCenter: position,
	});

	useFrame((_, delta) => {
		const body = rigidBodyRef.current;
		if (!body) return;
		const current = body.translation();
		const nextPos = getNextPosition(delta, [current.x, current.y, current.z]);
		body.setNextKinematicTranslation({
			x: nextPos[0],
			y: nextPos[1],
			z: nextPos[2],
		});
	});

	const { scene: rawScene } = useGLTF(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
	const { animations: moveAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC,
	);
	const { animations: generalAnims } = useGLTF(ENEMY_ANIMATION_PATHS.GENERAL);
	const { animations: meleeAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.COMBAT_MELEE,
	);

	const clonedScene = useMemo(() => skeletonClone(rawScene), [rawScene]);
	const allAnims = useMemo(
		() => [...moveAnims, ...generalAnims, ...meleeAnims],
		[moveAnims, generalAnims, meleeAnims],
	);

	const { actions } = useAnimations(allAnims, groupRef);

	useEffect(() => {
		const action = actions[animationName];
		if (!action) return;
		action.reset().fadeIn(0.2).play();
		return () => {
			action.fadeOut(0.2);
		};
	}, [actions, animationName]);

	return (
		<RigidBody
			ref={rigidBodyRef as RefObject<RapierRigidBody>}
			colliders="hull"
			position={position}
			type="kinematicPosition"
		>
			<group ref={groupRef}>
				<primitive
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
