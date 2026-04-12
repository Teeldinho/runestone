export type {
	AudioEventType,
	AudioMachineStateValue,
} from "./config";
export {
	AUDIO_CONTEXT_ERRORS,
	AUDIO_DEFAULTS,
	AUDIO_EVENTS,
	AUDIO_MACHINE_ID,
	AUDIO_MACHINE_STATES,
	AUDIO_PATHS,
} from "./config";
export { startBackgroundMusicLoop } from "./lib";
export {
	AudioContext,
	type AudioMachineContext,
	type AudioMachineEvent,
	type AudioMachineState,
	type AudioSettings,
	audioMachine,
	type UseAudioResult,
	useAudio,
	useAudioController,
} from "./model";
