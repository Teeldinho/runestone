import type { MouseEvent } from "react";

export const preventGameplayContextMenu = (
	event: MouseEvent<HTMLElement>,
): void => {
	event.preventDefault();
};
