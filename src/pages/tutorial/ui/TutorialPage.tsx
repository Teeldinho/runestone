import { useAuthContext } from "@/features/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

import { TUTORIAL_TAB_IDS, TUTORIAL_TABS } from "../config";

import { TutorialControlsPanel } from "./TutorialControlsPanel";
import { TutorialFirstRunPanel } from "./TutorialFirstRunPanel";
import { TutorialHero } from "./TutorialHero";

export function TutorialPage() {
	const { handleUsernameEntryRequest, isAuthenticated } = useAuthContext();

	return (
		<>
			<TutorialHero
				isAuthenticated={isAuthenticated}
				onEntryRequest={handleUsernameEntryRequest}
			/>

			<Tabs defaultValue={TUTORIAL_TAB_IDS.CONTROLS} className="gap-8">
				<TabsList className="!w-full !justify-start !gap-8 !rounded-none !border-0 !border-b !border-border/60 !bg-transparent !px-0 !pb-0 !pt-0">
					{TUTORIAL_TABS.map((tab) => (
						<TabsTrigger
							key={tab.id}
							value={tab.id}
							className="!rounded-none !border-0 !bg-transparent !px-0 !pb-3 !pt-0 !text-[11px] !uppercase !tracking-[0.18em] !text-panel-body data-[state=active]:!border-b data-[state=active]:!border-dungeon-gold data-[state=active]:!bg-transparent data-[state=active]:!text-dungeon-gold"
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={TUTORIAL_TAB_IDS.CONTROLS}>
					<TutorialControlsPanel />
				</TabsContent>

				<TabsContent value={TUTORIAL_TAB_IDS.FIRST_RUN}>
					<TutorialFirstRunPanel />
				</TabsContent>
			</Tabs>
		</>
	);
}
