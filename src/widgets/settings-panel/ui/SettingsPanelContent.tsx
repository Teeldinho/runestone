import { Separator } from "@/shared/ui";
import type { SettingsPanelViewModel } from "@/widgets/settings-panel/model";

import { SettingsPanelAudioSection } from "./SettingsPanelAudioSection";
import { SettingsPanelGraphicsSection } from "./SettingsPanelGraphicsSection";
import { SettingsPanelHapticsSection } from "./SettingsPanelHapticsSection";
import { SettingsPanelResetAction } from "./SettingsPanelResetAction";

type SettingsPanelContentProps = {
	settings: SettingsPanelViewModel;
};

export function SettingsPanelContent({ settings }: SettingsPanelContentProps) {
	return (
		<div className="space-y-8">
			<SettingsPanelAudioSection audio={settings.audio} />
			<Separator />
			<SettingsPanelGraphicsSection graphics={settings.graphics} />
			<Separator />
			<SettingsPanelHapticsSection haptics={settings.haptics} />
			<Separator />
			<SettingsPanelResetAction
				onReset={settings.actions.handleSettingsReset}
			/>
		</div>
	);
}
