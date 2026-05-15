import { Badge, Button } from "@/shared/ui";

import type { GamePageMobileActionPanelModel } from "../model";
import { useMobileActionPointerGuards } from "../model/useMobileActionPointerGuards";

type GamePageMobileTouchActionsProps = {
	touchActions: GamePageMobileActionPanelModel["touchActions"];
};

export function GamePageMobileTouchActions({
	touchActions,
}: GamePageMobileTouchActionsProps) {
	const { attack, interact } = touchActions;
	const { stopActionPointerPropagation } = useMobileActionPointerGuards();

	return (
		<>
			{interact.hasTouchInteract ? (
				<Button
					variant="default"
					size="default"
					onClick={interact.handleTouchInteract}
					onPointerDown={stopActionPointerPropagation}
					className="pointer-events-auto relative w-full font-bold"
				>
					{interact.touchInteractPrompt}
					<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-dungeon-gold p-0 shadow-[0_0_8px_var(--dungeon-gold)]" />
				</Button>
			) : null}

			{attack.hasTouchAttack ? (
				<Button
					variant="default"
					size="default"
					onClick={attack.handleTouchAttack}
					onPointerDown={stopActionPointerPropagation}
					className="pointer-events-auto relative w-full font-bold"
				>
					{attack.touchAttackPrompt}
					<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-success p-0 shadow-[0_0_8px_var(--success)]" />
				</Button>
			) : null}
		</>
	);
}
