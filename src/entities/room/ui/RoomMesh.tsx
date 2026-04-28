import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

import { ROOM_CONFIG } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";

import { ROOM_GLTF_CONFIG } from "../config";
import {
	getColumnPlacements,
	getFloorTilePositions,
	getRoomColumnColliderSettings,
	getTreasuryChestCollider,
	getTreasuryChestPosition,
} from "../lib";
import type {
	RoomDoorConfig,
	RoomSurfaceSettings,
	RoomTreasuryConfig,
} from "../model";
import { RoomFloor } from "./RoomFloor";
import { RoomTreasureKey } from "./RoomTreasureKey";
import { RoomTreasury } from "./RoomTreasury";
import { RoomWallSegment } from "./RoomWallSegment";

type RoomMeshProps = {
	position: Vector3Tuple;
	surface: RoomSurfaceSettings;
	doorConfig: RoomDoorConfig;
	treasuryConfig: RoomTreasuryConfig;
	showGrid?: boolean;
};

useGLTF.preload(ROOM_GLTF_CONFIG.FLOOR_TILE.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.WALL.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.WALL_DOORWAY.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.COLUMN.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.TORCH.PATH);
useGLTF.preload(ROOM_GLTF_CONFIG.CHEST.PATH);

export function RoomMesh({
	position,
	surface,
	doorConfig,
	treasuryConfig,
	showGrid = false,
}: RoomMeshProps) {
	const floorScene = useGLTF(ROOM_GLTF_CONFIG.FLOOR_TILE.PATH).scene;
	const wallScene = useGLTF(ROOM_GLTF_CONFIG.WALL.PATH).scene;
	const doorwayScene = useGLTF(ROOM_GLTF_CONFIG.WALL_DOORWAY.PATH).scene;
	const columnScene = useGLTF(ROOM_GLTF_CONFIG.COLUMN.PATH).scene;
	const torchScene = useGLTF(ROOM_GLTF_CONFIG.TORCH.PATH).scene;
	const chestScene = useGLTF(ROOM_GLTF_CONFIG.CHEST.PATH).scene;

	const floorTilePositions = useMemo(
		() =>
			getFloorTilePositions(
				ROOM_CONFIG.WIDTH,
				ROOM_CONFIG.DEPTH,
				ROOM_GLTF_CONFIG.FLOOR_TILE.TILE_SIZE,
			),
		[],
	);

	const columnPositions = useMemo(
		() => getColumnPlacements(ROOM_CONFIG.WIDTH, ROOM_CONFIG.DEPTH),
		[],
	);

	const columnColliders = useMemo(
		() => getRoomColumnColliderSettings(ROOM_CONFIG.WIDTH, ROOM_CONFIG.DEPTH),
		[],
	);

	const treasuryChestPosition = useMemo(
		() => getTreasuryChestPosition(ROOM_CONFIG.DEPTH),
		[],
	);

	const treasuryChestCollider = useMemo(
		() => getTreasuryChestCollider(ROOM_CONFIG.DEPTH),
		[],
	);

	return (
		<group position={position}>
			<RoomFloor
				layout={{
					columnColliders,
					columnPositions,
					floorTilePositions,
				}}
				scenes={{
					column: columnScene,
					floor: floorScene,
				}}
				showGrid={showGrid}
				surface={surface}
			/>

			<RoomWallSegment
				doorConfig={doorConfig}
				doorwayScene={doorwayScene}
				side="north"
				torchScene={torchScene}
				wallScene={wallScene}
			/>
			<RoomWallSegment
				doorConfig={doorConfig}
				doorwayScene={doorwayScene}
				side="south"
				torchScene={torchScene}
				wallScene={wallScene}
			/>
			<RoomWallSegment
				doorConfig={doorConfig}
				doorwayScene={doorwayScene}
				side="east"
				torchScene={torchScene}
				wallScene={wallScene}
			/>
			<RoomWallSegment
				doorConfig={doorConfig}
				doorwayScene={doorwayScene}
				side="west"
				torchScene={torchScene}
				wallScene={wallScene}
			/>

			<RoomTreasury
				chestScene={chestScene}
				isTreasury={treasuryConfig.isTreasury}
				treasuryChestCollider={treasuryChestCollider}
				treasuryChestPosition={treasuryChestPosition}
			/>

			<RoomTreasureKey visible={treasuryConfig.showTreasureKey} />
		</group>
	);
}
