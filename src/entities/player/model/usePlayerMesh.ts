import { useMemo } from "react";

import { PLAYER_ENTITY_CONFIG } from "../config";
import { createPlayerMeshSettings } from "../lib";
import type { PlayerMeshSettings, UsePlayerMeshInput } from "./types";

export const usePlayerMesh = (
	input: UsePlayerMeshInput = {},
): PlayerMeshSettings => {
	return useMemo(() => {
		const meshSettings = createPlayerMeshSettings({
			origin: PLAYER_ENTITY_CONFIG.ORIGIN,
		});

		return input.position
			? {
					...meshSettings,
					position: input.position,
				}
			: meshSettings;
	}, [input.position]);
};
