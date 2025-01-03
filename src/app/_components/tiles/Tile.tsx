import type { Tile } from '@/domain/tiles.model';
import Image from 'next/image';

export default function TileComponent({ tile }: { tile: Tile }) {
  return <Image
    src={tile.path}
    alt={tile.id}
    width={tile.size.width}
    height={tile.size.height}
  />;
}