import {
	HOME_MANIFEST_TONE_CLASS_NAMES,
	HOME_MANIFEST_TONES,
	type HomeManifestTone,
} from "../config";

export const resolveHomeManifestToneClassName = (
	tone: HomeManifestTone,
): string => {
	switch (tone) {
		case HOME_MANIFEST_TONES.ACTIVE:
		case HOME_MANIFEST_TONES.AVAILABLE:
		case HOME_MANIFEST_TONES.SEALED:
			return HOME_MANIFEST_TONE_CLASS_NAMES[tone];
	}
};
