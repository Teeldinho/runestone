import type { CSSProperties } from "react";

import type { StateVisualizerSectionId } from "@/features/state-visualizer";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";

type XStateInspectorPanelTabsProps = {
	handleSelectedSectionIdChange: (sectionId: string) => void;
	sectionTabs: Array<{
		id: StateVisualizerSectionId;
		label: string;
	}>;
	selectedSectionId: StateVisualizerSectionId;
	tabsListStyles: CSSProperties;
};

export function XStateInspectorPanelTabs({
	handleSelectedSectionIdChange,
	sectionTabs,
	selectedSectionId,
	tabsListStyles,
}: XStateInspectorPanelTabsProps) {
	return (
		<Tabs
			className="min-w-0"
			value={selectedSectionId}
			onValueChange={handleSelectedSectionIdChange}
		>
			<TabsList
				className="grid h-auto w-full min-w-0 gap-1 p-1"
				style={tabsListStyles}
			>
				{sectionTabs.map((sectionTab) => (
					<TabsTrigger
						key={sectionTab.id}
						value={sectionTab.id}
						className="h-7 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-[10px]"
					>
						{sectionTab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}

export type { XStateInspectorPanelTabsProps };
