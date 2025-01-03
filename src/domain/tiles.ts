import type { Tile } from './tiles.model';

const allTiles: Tile[] = [
  {
    id: '1A',
    path: '/tiles/fh-01a-snow.webp',
    size: {
      width: 717,
      height: 398,
    },
    hexes: [
      { x: 147, y: 129 },
      { x: 280, y: 129 },
      { x: 413, y: 129 },
      { x: 546, y: 129 },
      { x: 81, y: 244 },
      { x: 214, y: 244 },
      { x: 347, y: 244 },
      { x: 480, y: 244 },
      { x: 613, y: 244 },
    ],
  },
  {
    id: '3A',
    path: '/tiles/fh-03a-cave.webp',
    size: {
      width: 950,
      height: 762,
    },
    hexes: [
      { x: 210, y: 151 },
      { x: 343, y: 151 },
      { x: 144, y: 266 },
      { x: 277, y: 266 },
      { x: 410, y: 266 },
      { x: 210, y: 381 },
      { x: 343, y: 381 },
      { x: 476, y: 381 },
      { x: 609, y: 381 },
      { x: 742, y: 381 },
      { x: 277, y: 496 },
      { x: 410, y: 496 },
      { x: 543, y: 496 },
      { x: 676, y: 496 },
      { x: 809, y: 496 },
      { x: 343, y: 611 },
      { x: 476, y: 611 },
      { x: 609, y: 611 },
      { x: 742, y: 611 },
    ],
  },
];

export default allTiles;