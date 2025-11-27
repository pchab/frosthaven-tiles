import type { Hex } from "./tiles.model";

export interface Standee {
	id: string;
	position: Hex;
	type: "player" | "monster" | "loot";
}
