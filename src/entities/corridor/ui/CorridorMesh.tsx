import { RigidBody } from "@react-three/rapier";

import { CORRIDOR_ENTITY_CONFIG } from "../config";
import type { CorridorMeshSettings } from "../model";

type CorridorMeshProps = {
	settings: CorridorMeshSettings;
};

const WALL_HEIGHT = 3;
const HALF_WIDTH = CORRIDOR_ENTITY_CONFIG.DIMENSIONS.width / 2;

export function CorridorMesh({ settings }: CorridorMeshProps) {
	return (
		<group
			position={settings.position}
			rotation={[0, settings.rotationYRad, 0]}
		>
			{/* Floor - visual */}
			<mesh castShadow receiveShadow>
				<boxGeometry
					args={[
						CORRIDOR_ENTITY_CONFIG.DIMENSIONS.width,
						CORRIDOR_ENTITY_CONFIG.SURFACE.SLAB_HEIGHT,
						CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
					]}
				/>
				<meshStandardMaterial
					color={CORRIDOR_ENTITY_CONFIG.SURFACE.BASE_COLOR}
					metalness={CORRIDOR_ENTITY_CONFIG.SURFACE.METALNESS}
					roughness={CORRIDOR_ENTITY_CONFIG.SURFACE.ROUGHNESS}
				/>
			</mesh>

			{/* Floor - physics collider */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh position={[0, -0.3, 0]} visible={false}>
					<boxGeometry
						args={[
							CORRIDOR_ENTITY_CONFIG.DIMENSIONS.width,
							0.6,
							CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth,
						]}
					/>
					<meshStandardMaterial
						color={CORRIDOR_ENTITY_CONFIG.SURFACE.BASE_COLOR}
					/>
				</mesh>
			</RigidBody>

			{/* Left wall */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh
					castShadow
					position={[-HALF_WIDTH, WALL_HEIGHT / 2, 0]}
					receiveShadow
				>
					<boxGeometry
						args={[0.2, WALL_HEIGHT, CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth]}
					/>
					<meshStandardMaterial
						color={CORRIDOR_ENTITY_CONFIG.SURFACE.BASE_COLOR}
						metalness={CORRIDOR_ENTITY_CONFIG.SURFACE.METALNESS}
						roughness={CORRIDOR_ENTITY_CONFIG.SURFACE.ROUGHNESS}
					/>
				</mesh>
			</RigidBody>

			{/* Right wall */}
			<RigidBody type="fixed" colliders="cuboid">
				<mesh
					castShadow
					position={[HALF_WIDTH, WALL_HEIGHT / 2, 0]}
					receiveShadow
				>
					<boxGeometry
						args={[0.2, WALL_HEIGHT, CORRIDOR_ENTITY_CONFIG.DIMENSIONS.depth]}
					/>
					<meshStandardMaterial
						color={CORRIDOR_ENTITY_CONFIG.SURFACE.BASE_COLOR}
						metalness={CORRIDOR_ENTITY_CONFIG.SURFACE.METALNESS}
						roughness={CORRIDOR_ENTITY_CONFIG.SURFACE.ROUGHNESS}
					/>
				</mesh>
			</RigidBody>
		</group>
	);
}
