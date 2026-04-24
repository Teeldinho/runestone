import { SETTINGS_COPY, SETTINGS_VOLUME_RANGE } from "@/features/settings";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	Slider,
} from "@/shared/ui";
import type { SettingsPanelViewModel } from "@/widgets/settings-panel/model";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";

type SettingsPanelAudioSectionProps = {
	audio: SettingsPanelViewModel["audio"];
};

export function SettingsPanelAudioSection({
	audio,
}: SettingsPanelAudioSectionProps) {
	return (
		<section aria-labelledby={SETTINGS_PANEL_IDS.AUDIO_SECTION}>
			<FieldSet>
				<FieldLegend
					id={SETTINGS_PANEL_IDS.AUDIO_SECTION}
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
				>
					{SETTINGS_COPY.AUDIO_SECTION}
				</FieldLegend>

				<FieldGroup className="space-y-6">
					<Field>
						<FieldLabel
							id={SETTINGS_PANEL_IDS.MASTER_VOLUME_LABEL}
							htmlFor={SETTINGS_PANEL_IDS.MASTER_VOLUME_CONTROL}
						>
							{SETTINGS_COPY.MASTER_VOLUME_LABEL}
						</FieldLabel>
						<FieldDescription id={SETTINGS_PANEL_IDS.MASTER_VOLUME_DESCRIPTION}>
							{audio.masterVolumeLabel}
						</FieldDescription>
						<Slider
							aria-describedby={SETTINGS_PANEL_IDS.MASTER_VOLUME_DESCRIPTION}
							aria-labelledby={SETTINGS_PANEL_IDS.MASTER_VOLUME_LABEL}
							id={SETTINGS_PANEL_IDS.MASTER_VOLUME_CONTROL}
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
							htmlFor={SETTINGS_PANEL_IDS.MUSIC_VOLUME_CONTROL}
						>
							{SETTINGS_COPY.MUSIC_VOLUME_LABEL}
						</FieldLabel>
						<FieldDescription id={SETTINGS_PANEL_IDS.MUSIC_VOLUME_DESCRIPTION}>
							{audio.musicVolumeLabel}
						</FieldDescription>
						<Slider
							aria-describedby={SETTINGS_PANEL_IDS.MUSIC_VOLUME_DESCRIPTION}
							aria-labelledby={SETTINGS_PANEL_IDS.MUSIC_VOLUME_LABEL}
							id={SETTINGS_PANEL_IDS.MUSIC_VOLUME_CONTROL}
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
