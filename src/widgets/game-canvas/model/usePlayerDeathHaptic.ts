import { useEffect, useRef } from "react";

type UsePlayerDeathHapticInput = {
	healthState: string;
	deadState: string;
	onPlayerDeath: () => void;
};

export const usePlayerDeathHaptic = ({
	healthState,
	deadState,
	onPlayerDeath,
}: UsePlayerDeathHapticInput): void => {
	const hasTriggeredDeathRef = useRef(false);

	useEffect(() => {
		if (healthState !== deadState) {
			hasTriggeredDeathRef.current = false;
			return;
		}

		if (hasTriggeredDeathRef.current) {
			return;
		}

		hasTriggeredDeathRef.current = true;
		onPlayerDeath();
	}, [deadState, healthState, onPlayerDeath]);
};

export type { UsePlayerDeathHapticInput };
