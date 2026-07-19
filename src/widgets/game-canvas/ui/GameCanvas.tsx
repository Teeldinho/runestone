import { lazy, Suspense } from "react";
import { GameCanvasLoadingOverlay } from "./GameCanvasLoadingOverlay";
import type { GameCanvasProps } from "./GameCanvasRuntime";

const GameCanvasRuntime = lazy(() =>
	import("./GameCanvasRuntime").then((module) => ({
		default: module.GameCanvasRuntime,
	})),
);

export function GameCanvas(props: GameCanvasProps) {
	return (
		<Suspense
			fallback={
				<div className="relative h-full w-full overflow-hidden">
					<GameCanvasLoadingOverlay isVisible />
				</div>
			}
		>
			<GameCanvasRuntime {...props} />
		</Suspense>
	);
}
