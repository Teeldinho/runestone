import { useId } from "react";
import { SETTINGS_COPY } from "@/features/settings";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Separator,
} from "@/shared/ui";

import { useSettingsPanelViewModel } from "../model";
import { SettingsPanelAudioSection } from "./SettingsPanelAudioSection";
import { SettingsPanelGraphicsSection } from "./SettingsPanelGraphicsSection";
import { SettingsPanelHapticsSection } from "./SettingsPanelHapticsSection";
import { SettingsPanelResetAction } from "./SettingsPanelResetAction";

export function SettingsPanel() {
	const settings = useSettingsPanelViewModel();
	const masterVolumeDescId = useId();
	const musicVolumeDescId = useId();

	return (
		<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle className="text-3xl font-semibold text-panel-title">
					{SETTINGS_COPY.PAGE_TITLE}
				</CardTitle>
				<CardDescription className="text-base text-panel-body">
					{SETTINGS_COPY.PAGE_DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-8">
				<SettingsPanelAudioSection
					audio={settings.audio}
					descriptionIds={{
						masterVolume: masterVolumeDescId,
						musicVolume: musicVolumeDescId,
					}}
				/>
				<Separator />
				<SettingsPanelGraphicsSection graphics={settings.graphics} />
				<Separator />
				<SettingsPanelHapticsSection haptics={settings.haptics} />
				<Separator />
				<SettingsPanelResetAction
					onReset={settings.actions.handleSettingsReset}
				/>
			</CardContent>
		</Card>
	);
}
