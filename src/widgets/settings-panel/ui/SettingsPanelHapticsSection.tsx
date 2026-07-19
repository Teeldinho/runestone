import { SETTINGS_COPY } from "@/features/settings";
import { Field, FieldLabel, FieldLegend, FieldSet, Switch } from "@/shared/ui";
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
			<FieldSet>
				<FieldLegend
					id={SETTINGS_PANEL_IDS.HAPTICS_SECTION}
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
				>
					{SETTINGS_COPY.HAPTICS_SECTION}
				</FieldLegend>

				<Field orientation="horizontal" className="min-h-11">
					<FieldLabel
						htmlFor={SETTINGS_PANEL_IDS.HAPTICS_TOGGLE}
						className="min-h-11 items-center"
					>
						{SETTINGS_COPY.HAPTICS_TOGGLE_LABEL}
					</FieldLabel>
					<Switch
						checked={haptics.hapticsEnabled}
						id={SETTINGS_PANEL_IDS.HAPTICS_TOGGLE}
						onCheckedChange={haptics.handleHapticsToggle}
					/>
				</Field>
			</FieldSet>
		</section>
	);
}
