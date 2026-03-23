import { CorridorMesh } from "@/entities/corridor";
import { EnemyMesh } from "@/entities/enemy";
import { PlayerMesh } from "@/entities/player";
import { RoomLabel, RoomMesh } from "@/entities/room";
import {
	type CanvasEnvironmentSettings,
	useEnemySceneController,
	useSceneEnvironmentSettings,
} from "../model";

type SceneEnvironmentProps = {
	environment: CanvasEnvironmentSettings;
};

export function SceneEnvironment({ environment }: SceneEnvironmentProps) {
	const { corridorMeshSettings, roomMeshSettings, enemyMeshSettings } =
		useSceneEnvironmentSettings();
	const { playerPosition, handleEnemyDead } = useEnemySceneController();

	return (
		<>
			{corridorMeshSettings.map((corridorSetting) => (
				<CorridorMesh key={corridorSetting.id} settings={corridorSetting} />
			))}
			{roomMeshSettings.map((room) => (
				<RoomMesh
					key={room.roomId}
					position={room.position}
					surface={environment}
				/>
			))}
			{enemyMeshSettings.map((enemy) => (
				<EnemyMesh
					key={enemy.id}
					id={enemy.id}
					roomId={enemy.roomId}
					position={enemy.position}
					playerPosition={playerPosition}
					onDead={handleEnemyDead}
				/>
			))}
			<PlayerMesh />
			{roomMeshSettings.map((room) => (
				<RoomLabel key={`${room.roomId}:label`} settings={room.labelSettings} />
			))}
		</>
	);
}
