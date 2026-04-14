import { CorridorMesh } from "@/entities/corridor";
import { EnemyMesh } from "@/entities/enemy";
import { PlayerMesh } from "@/entities/player";
import { RoomLabel, RoomMesh } from "@/entities/room";
import type { Vector3Tuple } from "@/shared/lib";
import {
	type CanvasEnvironmentSettings,
	useEnemySceneController,
	useSceneEnvironmentSettings,
} from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
	playerSpawnPosition: Vector3Tuple;
};

export function SceneEnvironment({
	environment,
	playerSpawnPosition,
}: SceneEnvironmentProps) {
	const { corridorMeshSettings, roomMeshSettings, enemyMeshSettings } =
		useSceneEnvironmentSettings();
	const { handleEnemyDead, handleEnemyAttack } = useEnemySceneController();

	return (
		<>
			{corridorMeshSettings.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			{roomMeshSettings.map((room) => (
				<RoomMesh
					key={room.roomId}
					isTreasury={room.isTreasury}
					lockedDoorSides={room.lockedDoorSides}
					openedDoorSides={room.openedDoorSides}
					position={room.position}
					showTreasureKey={room.showTreasureKey}
					surface={environment}
					wallOpenings={room.wallOpenings}
				/>
			))}
			{enemyMeshSettings.map((enemy) => (
				<EnemyMesh
					key={enemy.id}
					id={enemy.id}
					roomId={enemy.roomId}
					position={enemy.position}
					patrolCenter={enemy.patrolCenter}
					onDead={handleEnemyDead}
					onAttack={handleEnemyAttack}
				/>
			))}
			<PlayerMesh initialPosition={playerSpawnPosition} />
			{roomMeshSettings.map((room) => (
				<RoomLabel key={`${room.roomId}:label`} settings={room.labelSettings} />
			))}
		</>
	);
}
