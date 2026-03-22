import { CORRIDOR_ENTITY_CONFIG } from "../config";
import type { CorridorMeshSettings } from "../model";

type CorridorMeshProps = {
	settings: CorridorMeshSettings;
};

export function CorridorMesh({ settings }: CorridorMeshProps) {
	return (
		<mesh
			castShadow
			position={settings.position}
			receiveShadow
			rotation={[0, settings.rotationYRad, 0]}
		>
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
	);
}
