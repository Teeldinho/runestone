import type { Vector3Tuple } from "@/shared/types";
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
	healthState,
	origin,
}: PlayerMeshInput): PlayerMeshSettings => {
	const auraStyle = PLAYER_ENTITY_CONFIG.AURA_STYLES_BY_HEALTH[healthState];

	return {
		auraColor: auraStyle.color,
		auraEmissiveIntensity: auraStyle.emissiveIntensity,
		position: getPlayerSpawnPosition({
			heightOffset: PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			origin,
		}),
	};
};

export type { PlayerSpawnPositionInput };
