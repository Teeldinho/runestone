type GltfPreloader = {
	preload: (assetPath: string) => void;
};

const shouldPreloadGltfAssets = () => import.meta.env.MODE !== "test";

export const preloadGltfAssets = (
	gltfPreloader: GltfPreloader,
	assetPaths: readonly string[],
): void => {
	if (!shouldPreloadGltfAssets()) {
		return;
	}

	for (const assetPath of assetPaths) {
		gltfPreloader.preload(assetPath);
	}
};

export { shouldPreloadGltfAssets };
