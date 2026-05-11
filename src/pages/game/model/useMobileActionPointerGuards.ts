import { useCallback } from "react";

export const useMobileActionPointerGuards = () => {
	const stopActionPointerPropagation = useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			event.preventDefault();
			event.stopPropagation();
		},
		[],
	);

	return { stopActionPointerPropagation };
};
