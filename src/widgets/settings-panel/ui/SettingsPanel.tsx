import {
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
									{Math.round(settings.masterVolume * 100)}%
								</FieldDescription>
								<Slider
									id="master-volume"
									value={[settings.masterVolume]}
									min={SETTINGS_VOLUME_RANGE.MIN}
									max={SETTINGS_VOLUME_RANGE.MAX}
									step={SETTINGS_VOLUME_RANGE.STEP}
									onValueChange={([value]) =>
										settings.handleMasterVolumeChange(value ?? 0)
									}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="music-volume">
									{SETTINGS_COPY.MUSIC_VOLUME_LABEL}
								</FieldLabel>
								<FieldDescription>
									{Math.round(settings.musicVolume * 100)}%
								</FieldDescription>
								<Slider
									id="music-volume"
									value={[settings.musicVolume]}
									min={SETTINGS_VOLUME_RANGE.MIN}
									max={SETTINGS_VOLUME_RANGE.MAX}
									step={SETTINGS_VOLUME_RANGE.STEP}
									onValueChange={([value]) =>
										settings.handleMusicVolumeChange(value ?? 0)
									}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="sfx-volume">
									{SETTINGS_COPY.SFX_VOLUME_LABEL}
								</FieldLabel>
								<FieldDescription>
									{Math.round(settings.sfxVolume * 100)}%
								</FieldDescription>
								<Slider
									id="sfx-volume"
									value={[settings.sfxVolume]}
									min={SETTINGS_VOLUME_RANGE.MIN}
									max={SETTINGS_VOLUME_RANGE.MAX}
									step={SETTINGS_VOLUME_RANGE.STEP}
									onValueChange={([value]) =>
										settings.handleSfxVolumeChange(value ?? 0)
									}
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
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
							onClick={() =>
								settings.handleHapticsToggle(!settings.hapticsEnabled)
							}
						>
							{settings.hapticsEnabled ? "On" : "Off"}
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
