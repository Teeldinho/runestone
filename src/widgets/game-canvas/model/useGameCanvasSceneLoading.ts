import { useCallback, useState } from "react";

type UseGameCanvasSceneLoadingResult = {
	handleSceneReady: () => void;
	isSceneLoading: boolean;
};

export const useGameCanvasSceneLoading =
	(): UseGameCanvasSceneLoadingResult => {
		const [isSceneLoading, setIsSceneLoading] = useState(true);

		const handleSceneReady = useCallback(() => {
			setIsSceneLoading(false);
		}, []);

		return {
			handleSceneReady,
			isSceneLoading,
		};
	};

export type { UseGameCanvasSceneLoadingResult };
