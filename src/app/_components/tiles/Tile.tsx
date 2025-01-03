'use client';

import type { Hex, Tile } from '@/domain/tiles.model';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const RADIUS = 58;

function drawCircleArea(hex: Hex, context: CanvasRenderingContext2D) {
  const { x, y } = hex;

  context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  context.lineWidth = 3;
  context.beginPath();
  context.arc(x, y, RADIUS, 0, 2 * Math.PI);
  context.stroke();
}

export default function TileComponent({ tile }: { tile: Tile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentHex, setCurrentHex] = useState<Hex>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.reset();
    if (currentHex === undefined) return;
    drawCircleArea(currentHex, context);
  }, [currentHex]);

  return <div className='relative'>
    <canvas
      ref={canvasRef}
      className='absolute pointer-events-none'
      width={tile.size.width}
      height={tile.size.height}
    />
    <map name={tile.id}>
      {tile.hexes.map((hex, index) => {
        return <area
          key={`${tile.id}-${index}`}
          coords={`${hex.x},${hex.y},${RADIUS}`}
          shape='circle'
          onMouseEnter={() => setCurrentHex(hex)}
        />;
      })}
    </map>
    <Image
      useMap={`#${tile.id}`}
      src={tile.path}
      alt={tile.id}
      width={tile.size.width}
      height={tile.size.height}
    />
  </div>;
}