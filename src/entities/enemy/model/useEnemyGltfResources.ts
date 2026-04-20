import { useAnimations, useGLTF } from "@react-three/drei";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";

import {
	ENEMY_ANIMATION_PATHS,
	ENEMY_GLTF_CONFIG,
} from "../config";

type UseEnemyGltfResourcesResult = {
	clonedScene: THREE.Object3D;
	groupRef: RefObject<THREE.Group | null>;
};

export const useEnemyGltfResources = (
	animationName: string,
): UseEnemyGltfResourcesResult => {
	const groupRef = useRef<THREE.Group>(null);

	const { scene: rawScene } = useGLTF(ENEMY_GLTF_CONFIG.CHARACTER.PATH);
	const { animations: moveAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.MOVEMENT_BASIC,
	);
	const { animations: generalAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.GENERAL,
	);
	const { animations: meleeAnims } = useGLTF(
		ENEMY_ANIMATION_PATHS.COMBAT_MELEE,
	);

	const clonedScene = useMemo(() => skeletonClone(rawScene), [rawScene]);
	const allAnims = useMemo(
		() => [...moveAnims, ...generalAnims, ...meleeAnims],
		[moveAnims, generalAnims, meleeAnims],
	);

	const { actions } = useAnimations(allAnims, groupRef);

	const fadeDuration = ENEMY_GLTF_CONFIG.CHARACTER.ANIMATION_FADE_DURATION_SEC;

	useEffect(() => {
		const action = actions[animationName];
		if (!action) return;
		action.reset().fadeIn(fadeDuration).play();
		return () => {
			action.fadeOut(fadeDuration);
		};
	}, [actions, animationName, fadeDuration]);

	return { clonedScene, groupRef };
};
