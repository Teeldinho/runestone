import { useEffect } from "react";

type SceneReadyReporterProps = {
	onSceneReady: () => void;
};

export function SceneReadyReporter({ onSceneReady }: SceneReadyReporterProps) {
	useEffect(() => {
		const readyFrame = window.requestAnimationFrame(onSceneReady);

		return () => {
			window.cancelAnimationFrame(readyFrame);
		};
	}, [onSceneReady]);

	return null;
}

export type { SceneReadyReporterProps };
