import { Skeleton } from "@/shared/ui";

import { GAME_CANVAS_COPY } from "../config";

type GameCanvasLoadingOverlayProps = {
	isVisible: boolean;
};

export function GameCanvasLoadingOverlay({
	isVisible,
}: GameCanvasLoadingOverlayProps) {
	if (!isVisible) {
		return null;
	}

	return (
		<div
			role="status"
			aria-label={GAME_CANVAS_COPY.LOADING_ARIA_LABEL}
			className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
		>
			<div className="flex w-52 flex-col items-center gap-3">
				<Skeleton className="h-24 w-full border border-panel-border/70 bg-panel" />
				<Skeleton className="h-3 w-36 bg-muted" />
				<p className="text-xs font-medium tracking-widest text-panel-body uppercase">
					{GAME_CANVAS_COPY.LOADING_LABEL}
				</p>
			</div>
		</div>
	);
}

export type { GameCanvasLoadingOverlayProps };
