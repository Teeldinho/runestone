export const INPUT_ACTOR_IDS = {
	MOVEMENT_INPUT: "input.actor.movement",
	LOOK_INPUT: "input.actor.look",
	ZOOM_INPUT: "input.actor.zoom",
	DISCRETE_ACTION_INPUT: "input.actor.discreteAction",
	PLAYER: "input.actor.player",
	CAMERA: "input.actor.camera",
	DUNGEON: "input.actor.dungeon",
	COMBAT: "input.actor.combat",
} as const;

export type InputActorId =
	(typeof INPUT_ACTOR_IDS)[keyof typeof INPUT_ACTOR_IDS];
