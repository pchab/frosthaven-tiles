import type { Tile } from './tiles.model';

const allTiles: Tile[] = [
  {
    id: '1A',
    path: '/tiles/fh-01a-snow.webp',
    size: { width: 717, height: 398 },
    padding: { x: 14, y: 129 },
    hexes: [
      { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }
    ]
  },
  {
    id: '3A',
    path: '/tiles/fh-03a-cave.webp',
    size: { width: 950, height: 762 },
    padding: { x: 77, y: 151 },
    hexes: [
      { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }
    ]
  }
];

export default allTiles;