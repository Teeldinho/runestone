import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Object3D } from "three";

import { ROOM_GLTF_CONFIG } from "../config";
import type { CuboidColliderSettings } from "../lib";
import type { Vector3Tuple } from "@/shared/lib";

type RoomTreasuryProps = {
	isTreasury: boolean;
	chestScene: Object3D;
	treasuryChestPosition: Vector3Tuple;
	treasuryChestCollider: CuboidColliderSettings;
};

export function RoomTreasury({
	isTreasury,
	chestScene,
	treasuryChestPosition,
	treasuryChestCollider,
}: RoomTreasuryProps) {
	if (!isTreasury) return null;

	return (
		<>
			<primitive
				castShadow
				object={chestScene.clone()}
				position={treasuryChestPosition}
				scale={ROOM_GLTF_CONFIG.CHEST.SCALE}
			/>
			<RigidBody type="fixed" colliders={false}>
				<CuboidCollider
					args={treasuryChestCollider.args}
					position={treasuryChestCollider.position}
				/>
			</RigidBody>
		</>
	);
}
