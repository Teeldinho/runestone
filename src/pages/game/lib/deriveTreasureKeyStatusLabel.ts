import { GAME_PAGE_COPY } from "@/pages/game/config";

export const deriveTreasureKeyStatusLabel = (hasTreasureKey: boolean) => {
	return hasTreasureKey
		? GAME_PAGE_COPY.TREASURE_KEY_STATUS.ACQUIRED
		: GAME_PAGE_COPY.TREASURE_KEY_STATUS.MISSING;
};
