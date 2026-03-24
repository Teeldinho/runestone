import type { RapierRigidBody } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import type { RefObject } from "react";

import { getCameraMode } from "@/shared/lib/cameraModeStore";

import { PLAYER_ENTITY_CONFIG } from "../config";
import { usePlayerMeshViewModel } from "../model/usePlayerMeshViewModel";

export function PlayerMesh() {
	const { meshSettings, rigidBodyRef } = usePlayerMeshViewModel();
	const isFirstPerson = getCameraMode() === "firstPerson";

	return (
		<RigidBody
			ref={rigidBodyRef as RefObject<RapierRigidBody>}
			colliders="hull"
			position={meshSettings.position}
			type="kinematicPosition"
		>
			{!isFirstPerson && (
				<>
					<mesh
						castShadow
						position={[0, PLAYER_ENTITY_CONFIG.BODY.POSITION_Y, 0]}
					>
						<cylinderGeometry
							args={[
								PLAYER_ENTITY_CONFIG.BODY.RADIUS,
								PLAYER_ENTITY_CONFIG.BODY.RADIUS,
								PLAYER_ENTITY_CONFIG.BODY.HEIGHT,
								PLAYER_ENTITY_CONFIG.BODY.RADIAL_SEGMENTS,
							]}
						/>
						<meshStandardMaterial
							color={PLAYER_ENTITY_CONFIG.BODY.COLOR}
							metalness={PLAYER_ENTITY_CONFIG.BODY.METALNESS}
							roughness={PLAYER_ENTITY_CONFIG.BODY.ROUGHNESS}
						/>
					</mesh>

					<mesh
						castShadow
						position={[0, PLAYER_ENTITY_CONFIG.HEAD.OFFSET_Y, 0]}
					>
						<sphereGeometry
							args={[
								PLAYER_ENTITY_CONFIG.HEAD.RADIUS,
								PLAYER_ENTITY_CONFIG.HEAD.WIDTH_SEGMENTS,
								PLAYER_ENTITY_CONFIG.HEAD.HEIGHT_SEGMENTS,
							]}
						/>
						<meshStandardMaterial color={PLAYER_ENTITY_CONFIG.HEAD.COLOR} />
					</mesh>

					<mesh
						position={[0, PLAYER_ENTITY_CONFIG.AURA.OFFSET_Y, 0]}
						rotation={[PLAYER_ENTITY_CONFIG.AURA.ROTATION_X_RAD, 0, 0]}
					>
						<torusGeometry
							args={[
								PLAYER_ENTITY_CONFIG.AURA.RADIUS,
								PLAYER_ENTITY_CONFIG.AURA.TUBE_RADIUS,
								PLAYER_ENTITY_CONFIG.AURA.RADIAL_SEGMENTS,
								PLAYER_ENTITY_CONFIG.AURA.TUBULAR_SEGMENTS,
							]}
						/>
						<meshStandardMaterial
							color={meshSettings.auraColor}
							emissive={meshSettings.auraColor}
							emissiveIntensity={meshSettings.auraEmissiveIntensity}
							opacity={PLAYER_ENTITY_CONFIG.AURA.MATERIAL_OPACITY}
							transparent
						/>
					</mesh>
				</>
			)}
		</RigidBody>
	);
}
