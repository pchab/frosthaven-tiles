import type { Tile } from './tiles.model';

const allTiles: Tile[] = [
  {
    id: '1A',
    path: '/tiles/fh-01a-snow.png',
    size: {
      width: 600,
      height: 323,
    },
    hexes: [
      { x: 116, y: 101 },
      { x: 232, y: 101 },
      { x: 348, y: 101 },
      { x: 464, y: 101 },
      { x: 58, y: 202 },
      { x: 174, y: 202 },
      { x: 290, y: 202 },
      { x: 406, y: 202 },
      { x: 522, y: 202 },
    ],
  },
];

export default allTiles;