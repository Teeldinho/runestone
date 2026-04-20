import { useEffect, useRef, useState } from "react";

import { usePlayerMachineRuntime } from "@/entities/player";

import { PLAYER_ENTITY_CONFIG } from "../config";

export const usePlayerDamageFlash = (): boolean => {
	const { snapshot } = usePlayerMachineRuntime();
	const currentHp = snapshot.context.stats.hp;
	const previousHpRef = useRef(currentHp);
	const [showDamageFlash, setShowDamageFlash] = useState(false);

	useEffect(() => {
		if (currentHp < previousHpRef.current) {
			setShowDamageFlash(true);
			const timeoutId = setTimeout(() => {
				setShowDamageFlash(false);
			}, PLAYER_ENTITY_CONFIG.DAMAGE_FLASH_DURATION_MS);

			return () => clearTimeout(timeoutId);
		}

		previousHpRef.current = currentHp;
	}, [currentHp]);

	return showDamageFlash;
};
