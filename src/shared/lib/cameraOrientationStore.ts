let currentCameraAzimuth = 0;

export const getCameraAzimuth = (): number => currentCameraAzimuth;

export const setCameraAzimuth = (azimuth: number): void => {
	currentCameraAzimuth = azimuth;
};
