import type { Vector3Tuple } from "@/shared/lib";
import { PLAYER_ENTITY_CONFIG } from "../config";
import type { PlayerMeshInput, PlayerMeshSettings } from "../model";

type PlayerSpawnPositionInput = {
	heightOffset: number;
	origin: Vector3Tuple;
};

export const getPlayerSpawnPosition = ({
	heightOffset,
	origin,
}: PlayerSpawnPositionInput): Vector3Tuple => {
	return [origin[0], origin[1] + heightOffset, origin[2]];
};

export const createPlayerMeshSettings = ({
	origin,
}: PlayerMeshInput): PlayerMeshSettings => {
	return {
		position: getPlayerSpawnPosition({
			heightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			origin,
		}),
	};
};

export type { PlayerSpawnPositionInput };
