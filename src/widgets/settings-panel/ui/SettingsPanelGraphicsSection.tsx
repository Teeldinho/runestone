import { SETTINGS_COPY } from "@/features/settings";
import { Field, FieldContent, FieldTitle, Switch } from "@/shared/ui";
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
			<h3
				id={SETTINGS_PANEL_IDS.GRAPHICS_SECTION}
				className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
			>
				{SETTINGS_COPY.GRAPHICS_SECTION}
			</h3>

			<Field orientation="horizontal">
				<FieldContent>
					<FieldTitle>{SETTINGS_COPY.POSTPROCESSING_TOGGLE_LABEL}</FieldTitle>
				</FieldContent>
				<Switch
					aria-label={SETTINGS_COPY.POSTPROCESSING_TOGGLE_LABEL}
					checked={graphics.postprocessingEnabled}
					onCheckedChange={graphics.handlePostprocessingToggle}
				/>
			</Field>
		</section>
	);
}
