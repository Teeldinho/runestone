import {
	GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES,
	GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS,
} from "@/pages/game/config";
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
		<div
			data-testid={GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_TEST_IDS.ROOT}
			className={GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.ROOT}
		>
			{interact.hasTouchInteract ? (
				<Button
					variant="default"
					size="default"
					onClick={interact.handleTouchInteract}
					onPointerDown={stopActionPointerPropagation}
					className={GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.BUTTON}
				>
					<span
						className={
							GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.BUTTON_LABEL
						}
					>
						{interact.touchInteractPrompt}
					</span>
					<Badge
						className={
							GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.INTERACT_BADGE
						}
					/>
				</Button>
			) : null}

			{attack.hasTouchAttack ? (
				<Button
					variant="default"
					size="default"
					onClick={attack.handleTouchAttack}
					onPointerDown={stopActionPointerPropagation}
					className={GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.BUTTON}
				>
					<span
						className={
							GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.BUTTON_LABEL
						}
					>
						{attack.touchAttackPrompt}
					</span>
					<Badge
						className={
							GAME_PAGE_MOBILE_TOUCH_ACTION_PANEL_CLASS_NAMES.ATTACK_BADGE
						}
					/>
				</Button>
			) : null}
		</div>
	);
}
