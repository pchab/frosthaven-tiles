export interface Hex {
	x: number;
	y: number;
}

export interface Tile {
	id: string;
	path: string;
	size: {
		width: number;
		height: number;
	};
	padding: Hex;
	rotation?: number;
	hexes: Hex[];
	doors?: Hex[];
	debugScale?: {
		width: number;
	};
}
