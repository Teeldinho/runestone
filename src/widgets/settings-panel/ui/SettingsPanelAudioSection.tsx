import { SETTINGS_COPY, SETTINGS_VOLUME_RANGE } from "@/features/settings";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
	Slider,
} from "@/shared/ui";
import type { SettingsPanelViewModel } from "@/widgets/settings-panel/model";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";

type SettingsPanelAudioSectionProps = {
	audio: SettingsPanelViewModel["audio"];
	descriptionIds: {
		masterVolume: string;
		musicVolume: string;
	};
};

export function SettingsPanelAudioSection({
	audio,
	descriptionIds,
}: SettingsPanelAudioSectionProps) {
	return (
		<section aria-labelledby={SETTINGS_PANEL_IDS.AUDIO_SECTION}>
			<h3
				id={SETTINGS_PANEL_IDS.AUDIO_SECTION}
				className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
			>
				{SETTINGS_COPY.AUDIO_SECTION}
			</h3>

			<FieldSet>
				<FieldGroup className="space-y-6">
					<Field>
						<FieldLabel
							id={SETTINGS_PANEL_IDS.MASTER_VOLUME_LABEL}
							htmlFor="master-volume"
						>
							{SETTINGS_COPY.MASTER_VOLUME_LABEL}
						</FieldLabel>
						<FieldDescription id={descriptionIds.masterVolume}>
							{audio.masterVolumeLabel}
						</FieldDescription>
						<Slider
							aria-describedby={descriptionIds.masterVolume}
							aria-labelledby={SETTINGS_PANEL_IDS.MASTER_VOLUME_LABEL}
							id="master-volume"
							max={SETTINGS_VOLUME_RANGE.MAX}
							min={SETTINGS_VOLUME_RANGE.MIN}
							onValueChange={audio.handleMasterVolumeSliderChange}
							step={SETTINGS_VOLUME_RANGE.STEP}
							value={[audio.masterVolume]}
						/>
					</Field>

					<Field>
						<FieldLabel
							id={SETTINGS_PANEL_IDS.MUSIC_VOLUME_LABEL}
							htmlFor="music-volume"
						>
							{SETTINGS_COPY.MUSIC_VOLUME_LABEL}
						</FieldLabel>
						<FieldDescription id={descriptionIds.musicVolume}>
							{audio.musicVolumeLabel}
						</FieldDescription>
						<Slider
							aria-describedby={descriptionIds.musicVolume}
							aria-labelledby={SETTINGS_PANEL_IDS.MUSIC_VOLUME_LABEL}
							id="music-volume"
							max={SETTINGS_VOLUME_RANGE.MAX}
							min={SETTINGS_VOLUME_RANGE.MIN}
							onValueChange={audio.handleMusicVolumeSliderChange}
							step={SETTINGS_VOLUME_RANGE.STEP}
							value={[audio.musicVolume]}
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
		</section>
	);
}
