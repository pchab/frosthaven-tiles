"use client";

import type { Hex, Tile } from "@/domain/tiles.model";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const RADIUS = 58;
const HEX_WIDTH = 133; // adjusted based on your tile measurements
const HEX_HEIGHT = 115;
const ROW_OFFSET = HEX_WIDTH / 2;

function getHexPixelPosition(
	hex: Hex,
	padding: { x: number; y: number },
): { x: number; y: number } {
	return {
		x: padding.x + hex.x * HEX_WIDTH + (hex.y % 2 === 1 ? ROW_OFFSET : 0),
		y: padding.y + hex.y * HEX_HEIGHT,
	};
}

function drawCircleArea(hex: Hex, context: CanvasRenderingContext2D) {
	const { x, y } = hex;

	context.strokeStyle = "rgba(255, 255, 255, 0.5)";
	context.lineWidth = 3;
	context.beginPath();
	context.arc(x, y, RADIUS, 0, 2 * Math.PI);
	context.stroke();
}

export default function TileComponent({ tile }: { tile: Tile }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [currentHex, setCurrentHex] = useState<Hex>({ x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		context.reset();
		if (currentHex === undefined) return;
		drawCircleArea(currentHex, context);
	}, [currentHex]);

	return (
		<div
			className="relative"
			style={{
				transform: `rotate(${tile.rotation}deg)`,
				transformOrigin: "center",
			}}
		>
			<canvas
				ref={canvasRef}
				className="absolute pointer-events-none"
				width={tile.size.width}
				height={tile.size.height}
			/>
			<map name={tile.id}>
				{tile.hexes.map((hex, index) => {
					const pixelPos = getHexPixelPosition(hex, tile.padding);
					return (
						<area
							key={`${tile.id}-${index}`}
							coords={`${pixelPos.x},${pixelPos.y},${RADIUS}`}
							shape="circle"
							onMouseEnter={() => setCurrentHex(pixelPos)}
						/>
					);
				})}
			</map>
			<Image
				useMap={`#${tile.id}`}
				src={tile.path}
				alt={tile.id}
				width={tile.size.width}
				height={tile.size.height}
			/>
		</div>
	);
}
