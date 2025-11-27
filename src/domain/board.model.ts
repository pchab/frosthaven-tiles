import type { Tile } from "./tiles.model";

export interface Position {
	x: number;
	y: number;
}

export interface PlacedTile {
	id: string; // Unique ID for this instance on the board
	tileId: string; // ID of the tile definition (e.g., "1A")
	x: number; // Pixel X
	y: number; // Pixel Y
	rotation: number; // Degrees (0, 60, 120, 180, 240, 300)
}

export interface Figure {
	id: string;
	name: string;
	type: "player" | "monster" | "summon";
	imagePath?: string; // Optional custom image
	x: number; // Pixel X (or hex coordinate if we go that route, but pixels are easier for free movement)
	y: number; // Pixel Y
}

export interface BoardState {
	tiles: PlacedTile[];
	figures: Figure[];
}
