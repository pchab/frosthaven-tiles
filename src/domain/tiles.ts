import type { Tile } from './tiles.model';

const allTiles: Tile[] = [
  {
    id: '1A',
    path: '/tiles/fh-01a-snow.png',
    size: {
      width: 600,
      height: 323,
    },
    hex: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
  },
];

export default allTiles;