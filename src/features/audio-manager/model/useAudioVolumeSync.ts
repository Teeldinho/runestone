import { useEffect } from "react";
import * as Tone from "tone";

import { setBackgroundMusicVolume } from "../lib";

type UseAudioVolumeSyncInput = {
	masterVolume: number;
	musicVolume: number;
};

export const useAudioVolumeSync = ({
	masterVolume,
	musicVolume,
}: UseAudioVolumeSyncInput) => {
	useEffect(() => {
		Tone.getDestination().volume.value = Tone.gainToDb(masterVolume);
		setBackgroundMusicVolume(musicVolume);
	}, [masterVolume, musicVolume]);
};
