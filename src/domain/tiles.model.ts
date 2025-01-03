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
  rotation?: number;
  hexes: Hex[];
}