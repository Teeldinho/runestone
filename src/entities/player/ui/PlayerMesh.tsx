import { useAnimations, useGLTF } from "@react-three/drei";
import type { RapierRigidBody } from "@react-three/rapier";
import {
	CapsuleCollider,
	CuboidCollider,
	RigidBody,
} from "@react-three/rapier";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { Vector3Tuple } from "@/shared/lib";

import {
	PLAYER_ANIMATION_PATHS,
	PLAYER_ENTITY_CONFIG,
	PLAYER_GLTF_CONFIG,
} from "../config";
import { usePlayerCameraFollowPositionSync } from "../model/usePlayerCameraFollowPositionSync";
import { usePlayerMeshViewModel } from "../model/usePlayerMeshViewModel";

useGLTF.preload(PLAYER_GLTF_CONFIG.CHARACTER.PATH);
useGLTF.preload(PLAYER_ANIMATION_PATHS.MOVEMENT_BASIC);
useGLTF.preload(PLAYER_ANIMATION_PATHS.GENERAL);

type PlayerMeshProps = {
	initialPosition?: Vector3Tuple;
};

export function PlayerMesh({ initialPosition }: PlayerMeshProps) {
	const {
		isAvatarVisible,
		groundSensorColliderProps,
		meshSettings,
		rigidBodyRef,
		animationName,
	} = usePlayerMeshViewModel({ initialPosition });

	const groupRef = useRef<THREE.Group>(null);

	usePlayerCameraFollowPositionSync({
		groupRef,
	});

	const { scene } = useGLTF(PLAYER_GLTF_CONFIG.CHARACTER.PATH);
	const { animations: moveAnims } = useGLTF(
		PLAYER_ANIMATION_PATHS.MOVEMENT_BASIC,
	);
	const { animations: generalAnims } = useGLTF(PLAYER_ANIMATION_PATHS.GENERAL);

	const clonedScene = useMemo(() => skeletonClone(scene), [scene]);
	const allAnims = useMemo(
		() => [...moveAnims, ...generalAnims],
		[moveAnims, generalAnims],
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
			ccd
			colliders={false}
			linearDamping={PLAYER_ENTITY_CONFIG.PHYSICS.LINEAR_DAMPING}
			lockRotations
			position={meshSettings.position}
			type="dynamic"
		>
			<CapsuleCollider
				args={[
					PLAYER_ENTITY_CONFIG.CAPSULE.HALF_HEIGHT,
					PLAYER_ENTITY_CONFIG.CAPSULE.RADIUS,
				]}
			/>
			<CuboidCollider {...groundSensorColliderProps} />
			<group ref={groupRef}>
				{isAvatarVisible && (
					<primitive
						frustumCulled={false}
						object={clonedScene}
						position={[0, PLAYER_GLTF_CONFIG.CHARACTER.POSITION_Y, 0]}
						scale={PLAYER_GLTF_CONFIG.CHARACTER.SCALE}
					/>
				)}
			</group>
		</RigidBody>
	);
}
