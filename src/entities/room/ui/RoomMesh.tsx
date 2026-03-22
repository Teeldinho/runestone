import { DoubleSide } from "three";

import type { Vector3Tuple } from "@/shared/types";
import type { RoomSurfaceSettings } from "../model";

type RoomMeshProps = {
	position: Vector3Tuple;
	surface: RoomSurfaceSettings;
};

export function RoomMesh({ position, surface }: RoomMeshProps) {
	const { floor, grid, pillar, rune } = surface;

	return (
		<group position={position}>
			<mesh
				position={[0, floor.offsetY, 0]}
				receiveShadow
				rotation={[floor.rotationXRad, 0, 0]}
			>
				<planeGeometry args={floor.size} />
				<meshStandardMaterial
					color={floor.color}
					metalness={floor.metalness}
					roughness={floor.roughness}
					side={DoubleSide}
				/>
			</mesh>

			<mesh castShadow position={[0, pillar.positionY, 0]} receiveShadow>
				<cylinderGeometry
					args={[
						pillar.radius,
						pillar.radius,
						pillar.height,
						pillar.radialSegments,
					]}
				/>
				<meshStandardMaterial
					color={pillar.color}
					metalness={pillar.metalness}
					roughness={pillar.roughness}
				/>
			</mesh>

			<mesh castShadow position={[0, rune.orbHeight, 0]}>
				<sphereGeometry
					args={[rune.orbRadius, rune.orbWidthSegments, rune.orbHeightSegments]}
				/>
				<meshStandardMaterial
					color={rune.activeColor}
					emissive={rune.openColor}
					emissiveIntensity={rune.emissiveIntensity}
				/>
			</mesh>

			<gridHelper
				args={[grid.size, grid.divisions, rune.sealedColor, pillar.color]}
				position={[0, floor.offsetY + grid.offsetY, 0]}
			/>
		</group>
	);
}
