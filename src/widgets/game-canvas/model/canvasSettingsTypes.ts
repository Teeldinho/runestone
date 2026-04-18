import type { Vector3Tuple } from "@/shared/lib";

type CanvasCameraSettings = {
	far: number;
	fov: number;
	near: number;
	position: [number, number, number];
	zoom: number;
};

type CanvasRendererSettings = {
	dprRange: [number, number];
	shadowsEnabled: boolean;
};

type CanvasFogSettings = {
	color: string;
	density: number;
};

type CanvasLightingSettings = {
	ambient: {
		color: string;
		intensity: number;
	};
	torch: {
		color: string;
		decay: number;
		distance: number;
		intensity: number;
		positions: [number, number, number][];
	};
};

type CanvasEnvironmentSettings = {
	floor: {
		color: string;
		metalness: number;
		offsetY: number;
		roughness: number;
		rotationXRad: number;
		size: [number, number];
	};
	grid: {
		divisions: number;
		offsetY: number;
		size: number;
	};
	pillar: {
		color: string;
		height: number;
		metalness: number;
		positionY: number;
		radius: number;
		radialSegments: number;
		roughness: number;
	};
	rune: {
		activeColor: string;
		emissiveIntensity: number;
		openColor: string;
		orbHeight: number;
		orbHeightSegments: number;
		orbRadius: number;
		orbWidthSegments: number;
		sealedColor: string;
	};
	wall: {
		color: string;
		roughness: number;
		metalness: number;
	};
};

type CanvasPostprocessingSettings = {
	enabled: boolean;
	bloom: {
		luminanceThreshold: number;
		luminanceSmoothing: number;
		intensity: number;
		mipmapBlur: boolean;
	};
	vignette: {
		offset: number;
		darkness: number;
	};
};

type CanvasSettingsViewModel = {
	camera: CanvasCameraSettings;
	environment: CanvasEnvironmentSettings;
	fog: CanvasFogSettings;
	lighting: CanvasLightingSettings;
	postprocessing: CanvasPostprocessingSettings;
	renderer: CanvasRendererSettings;
};

type CanvasMachineSettingsViewModel = CanvasSettingsViewModel & {
	isPostprocessingEnabled: boolean;
	playerSpawnPosition: Vector3Tuple;
};

export type {
	CanvasCameraSettings,
	CanvasEnvironmentSettings,
	CanvasFogSettings,
	CanvasLightingSettings,
	CanvasMachineSettingsViewModel,
	CanvasPostprocessingSettings,
	CanvasRendererSettings,
	CanvasSettingsViewModel,
};
