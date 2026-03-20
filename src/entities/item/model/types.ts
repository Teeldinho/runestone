export type ItemType = "keyRune" | "healthRune" | "scoreRune";

export type ItemRarity = "common" | "rare" | "legendary";

export type CollectibleItem = {
	id: string;
	roomId: string;
	type: ItemType;
	rarity: ItemRarity;
	value: number;
	collected: boolean;
};
