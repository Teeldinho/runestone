import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";

import { CORRIDOR_GLTF_CONFIG } from "../config";

type CorridorMeshScenes = {
	floorScene: THREE.Group;
	torchScene: THREE.Group;
	wallScene: THREE.Group;
	wallVariationScene: THREE.Group;
};

useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL_CRACKED.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.WALL_SHELVES.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.FLOOR_TILE.PATH);
useGLTF.preload(CORRIDOR_GLTF_CONFIG.TORCH.PATH);

export const useCorridorMeshScenes = (
	corridorId: string,
): CorridorMeshScenes => {
	const wallScene = useGLTF(CORRIDOR_GLTF_CONFIG.WALL.PATH).scene;
	const wallCrackedScene = useGLTF(
		CORRIDOR_GLTF_CONFIG.WALL_CRACKED.PATH,
	).scene;
	const wallShelvesScene = useGLTF(
		CORRIDOR_GLTF_CONFIG.WALL_SHELVES.PATH,
	).scene;
	const floorScene = useGLTF(CORRIDOR_GLTF_CONFIG.FLOOR_TILE.PATH).scene;
	const torchScene = useGLTF(CORRIDOR_GLTF_CONFIG.TORCH.PATH).scene;

	const isCrackedWall = corridorId.endsWith("-wall-cracked");

	return {
		floorScene,
		torchScene,
		wallScene,
		wallVariationScene: isCrackedWall ? wallCrackedScene : wallShelvesScene,
	};
};

export type { CorridorMeshScenes };
