import { SETTINGS_COPY } from "@/features/settings";
import { Field, FieldContent, FieldTitle, Switch } from "@/shared/ui";
import type { SettingsPanelViewModel } from "@/widgets/settings-panel/model";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";

type SettingsPanelHapticsSectionProps = {
	haptics: SettingsPanelViewModel["haptics"];
};

export function SettingsPanelHapticsSection({
	haptics,
}: SettingsPanelHapticsSectionProps) {
	return (
		<section aria-labelledby={SETTINGS_PANEL_IDS.HAPTICS_SECTION}>
			<h3
				id={SETTINGS_PANEL_IDS.HAPTICS_SECTION}
				className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
			>
				{SETTINGS_COPY.HAPTICS_SECTION}
			</h3>

			<Field orientation="horizontal">
				<FieldContent>
					<FieldTitle>{SETTINGS_COPY.HAPTICS_TOGGLE_LABEL}</FieldTitle>
				</FieldContent>
				<Switch
					aria-label={SETTINGS_COPY.HAPTICS_TOGGLE_LABEL}
					checked={haptics.hapticsEnabled}
					onCheckedChange={haptics.handleHapticsToggle}
				/>
			</Field>
		</section>
	);
}
