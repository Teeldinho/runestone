import { useEffect, useRef } from "react";

type UseDoorwayGuardFeedbackInput = {
	lastDoorwayFeedback: string | null | undefined;
	onGuardFail: () => void;
};

export const useDoorwayGuardFeedback = ({
	lastDoorwayFeedback,
	onGuardFail,
}: UseDoorwayGuardFeedbackInput): void => {
	const previousDoorwayFeedbackRef = useRef<string | null>(null);

	useEffect(() => {
		if (
			lastDoorwayFeedback &&
			lastDoorwayFeedback !== previousDoorwayFeedbackRef.current
		) {
			onGuardFail();
		}

		previousDoorwayFeedbackRef.current = lastDoorwayFeedback ?? null;
	}, [lastDoorwayFeedback, onGuardFail]);
};

export type { UseDoorwayGuardFeedbackInput };
