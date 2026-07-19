import type { CSSProperties } from "react";

import type { StateVisualizerSectionId } from "@/features/state-visualizer";
import { TabsList, TabsTrigger } from "@/shared/ui";

type XStateInspectorPanelTabsProps = {
	sectionTabs: Array<{
		id: StateVisualizerSectionId;
		label: string;
	}>;
	tabsListStyles: CSSProperties;
};

export function XStateInspectorPanelTabs({
	sectionTabs,
	tabsListStyles,
}: XStateInspectorPanelTabsProps) {
	return (
		<TabsList
			className="grid h-auto w-full min-w-0 gap-1 p-1"
			style={tabsListStyles}
		>
			{sectionTabs.map((sectionTab) => (
				<TabsTrigger
					key={sectionTab.id}
					value={sectionTab.id}
					className="min-h-11 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-0.5 text-[9px] tracking-tight xl:px-1.5 xl:text-[10px] xl:tracking-normal"
				>
					{sectionTab.label}
				</TabsTrigger>
			))}
		</TabsList>
	);
}

export type { XStateInspectorPanelTabsProps };
