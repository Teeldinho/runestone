import { SETTINGS_COPY } from "@/features/settings";
import { Field, FieldLabel, FieldLegend, FieldSet, Switch } from "@/shared/ui";
import type { SettingsPanelViewModel } from "@/widgets/settings-panel/model";

import { SETTINGS_PANEL_IDS } from "../config/settingsPanelConfig";

type SettingsPanelGraphicsSectionProps = {
	graphics: SettingsPanelViewModel["graphics"];
};

export function SettingsPanelGraphicsSection({
	graphics,
}: SettingsPanelGraphicsSectionProps) {
	return (
		<section aria-labelledby={SETTINGS_PANEL_IDS.GRAPHICS_SECTION}>
			<FieldSet>
				<FieldLegend
					id={SETTINGS_PANEL_IDS.GRAPHICS_SECTION}
					className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
				>
					{SETTINGS_COPY.GRAPHICS_SECTION}
				</FieldLegend>

				<Field orientation="horizontal" className="min-h-11">
					<FieldLabel
						htmlFor={SETTINGS_PANEL_IDS.POSTPROCESSING_TOGGLE}
						className="min-h-11 items-center"
					>
						{SETTINGS_COPY.POSTPROCESSING_TOGGLE_LABEL}
					</FieldLabel>
					<Switch
						checked={graphics.postprocessingEnabled}
						id={SETTINGS_PANEL_IDS.POSTPROCESSING_TOGGLE}
						onCheckedChange={graphics.handlePostprocessingToggle}
					/>
				</Field>
			</FieldSet>
		</section>
	);
}
