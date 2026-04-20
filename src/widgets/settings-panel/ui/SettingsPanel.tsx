import {
	formatVolumePercent,
	resolveToggleLabel,
	SETTINGS_COPY,
	SETTINGS_VOLUME_RANGE,
	useSettingsForm,
} from "@/features/settings";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldTitle,
	Separator,
	Slider,
} from "@/shared/ui";

export function SettingsPanel() {
	const settings = useSettingsForm();

	return (
		<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle
					id="settings-heading"
					className="text-3xl font-semibold text-panel-title"
				>
					{SETTINGS_COPY.PAGE_TITLE}
				</CardTitle>
				<CardDescription className="text-base text-panel-body">
					{SETTINGS_COPY.PAGE_DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-8">
				<section aria-labelledby="audio-settings-heading">
					<h3
						id="audio-settings-heading"
						className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
					>
						{SETTINGS_COPY.AUDIO_SECTION}
					</h3>

					<FieldSet>
						<FieldGroup className="space-y-6">
							<Field>
								<FieldLabel htmlFor="master-volume">
									{SETTINGS_COPY.MASTER_VOLUME_LABEL}
								</FieldLabel>
								<FieldDescription>
									{formatVolumePercent(settings.masterVolume)}
								</FieldDescription>
								<Slider
									id="master-volume"
									value={[settings.masterVolume]}
									min={SETTINGS_VOLUME_RANGE.MIN}
									max={SETTINGS_VOLUME_RANGE.MAX}
									step={SETTINGS_VOLUME_RANGE.STEP}
									onValueChange={settings.handleMasterVolumeSliderChange}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="music-volume">
									{SETTINGS_COPY.MUSIC_VOLUME_LABEL}
								</FieldLabel>
								<FieldDescription>
									{formatVolumePercent(settings.musicVolume)}
								</FieldDescription>
								<Slider
									id="music-volume"
									value={[settings.musicVolume]}
									min={SETTINGS_VOLUME_RANGE.MIN}
									max={SETTINGS_VOLUME_RANGE.MAX}
									step={SETTINGS_VOLUME_RANGE.STEP}
									onValueChange={settings.handleMusicVolumeSliderChange}
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
				</section>

				<Separator />

				<section aria-labelledby="graphics-settings-heading">
					<h3
						id="graphics-settings-heading"
						className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
					>
						{SETTINGS_COPY.GRAPHICS_SECTION}
					</h3>

					<Field orientation="horizontal">
						<FieldContent>
							<FieldTitle>
								{SETTINGS_COPY.POSTPROCESSING_TOGGLE_LABEL}
							</FieldTitle>
						</FieldContent>
						<Button
							variant={settings.postprocessingEnabled ? "default" : "outline"}
							aria-pressed={settings.postprocessingEnabled}
							onClick={settings.handlePostprocessingToggleClick}
						>
							{resolveToggleLabel(
								settings.postprocessingEnabled,
								SETTINGS_COPY.POSTPROCESSING_ON_LABEL,
								SETTINGS_COPY.POSTPROCESSING_OFF_LABEL,
							)}
						</Button>
					</Field>
				</section>

				<Separator />

				<section aria-labelledby="haptics-settings-heading">
					<h3
						id="haptics-settings-heading"
						className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
					>
						{SETTINGS_COPY.HAPTICS_SECTION}
					</h3>

					<Field orientation="horizontal">
						<FieldContent>
							<FieldTitle>{SETTINGS_COPY.HAPTICS_TOGGLE_LABEL}</FieldTitle>
						</FieldContent>
						<Button
							variant={settings.hapticsEnabled ? "default" : "outline"}
							aria-pressed={settings.hapticsEnabled}
							onClick={settings.handleHapticsToggleClick}
						>
							{resolveToggleLabel(
								settings.hapticsEnabled,
								SETTINGS_COPY.HAPTICS_ON_LABEL,
								SETTINGS_COPY.HAPTICS_OFF_LABEL,
							)}
						</Button>
					</Field>
				</section>

				<Separator />

				<Button variant="secondary" onClick={settings.handleSettingsReset}>
					{SETTINGS_COPY.RESET_BUTTON}
				</Button>
			</CardContent>
		</Card>
	);
}
