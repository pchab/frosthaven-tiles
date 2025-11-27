"use client";

import React, { useState, useRef } from "react";
import type { BoardState, PlacedTile, Figure } from "../../domain/board.model";
import allTiles from "../../domain/tiles";
import { allFigures } from "../../domain/figures";

interface BoardProps {
	boardState: BoardState;
	onUpdateBoard: (newState: BoardState) => void;
}

export function Board({ boardState, onUpdateBoard }: BoardProps) {
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const boardRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (
		e: React.MouseEvent,
		id: string,
		type: "tile" | "figure",
		initialX: number,
		initialY: number,
	) => {
		e.stopPropagation();
		setDraggingId(id);
		setDragOffset({ x: e.clientX - initialX, y: e.clientY - initialY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!draggingId || !boardRef.current) return;

		const newX = e.clientX - dragOffset.x;
		const newY = e.clientY - dragOffset.y;

		// Update tile position
		const updatedTiles = boardState.tiles.map((tile) => {
			if (tile.id === draggingId) {
				return { ...tile, x: newX, y: newY };
			}
			return tile;
		});

		// Update figure position
		const updatedFigures = boardState.figures.map((fig) => {
			if (fig.id === draggingId) {
				return { ...fig, x: newX, y: newY };
			}
			return fig;
		});

		onUpdateBoard({
			...boardState,
			tiles: updatedTiles,
			figures: updatedFigures,
		});
	};

	const handleMouseUp = () => {
		setDraggingId(null);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const tileId = e.dataTransfer.getData("tileId");
		const figureId = e.dataTransfer.getData("figureId");

		const rect = boardRef.current?.getBoundingClientRect();
		const x = e.clientX - (rect?.left || 0);
		const y = e.clientY - (rect?.top || 0);

		if (tileId) {
			const tileDef = allTiles.find((t) => t.id === tileId);
			if (tileDef) {
				const newTile: PlacedTile = {
					id: crypto.randomUUID(),
					tileId: tileDef.id,
					x: x - tileDef.size.width / 2, // Center it
					y: y - tileDef.size.height / 2,
					rotation: 0,
				};
				onUpdateBoard({
					...boardState,
					tiles: [...boardState.tiles, newTile],
				});
			}
		} else if (figureId) {
			const figureDef = allFigures.find((f) => f.id === figureId);
			if (figureDef) {
				const newFigure: Figure = {
					id: crypto.randomUUID(),
					name: figureDef.name,
					type: figureDef.type,
					x: x - 16, // Center 32x32
					y: y - 16,
				};

				onUpdateBoard({
					...boardState,
					figures: [...boardState.figures, newFigure],
				});
			}
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleTileDoubleClick = (e: React.MouseEvent, tileId: string) => {
		e.stopPropagation();
		const updatedTiles = boardState.tiles.map((tile) => {
			if (tile.id === tileId) {
				return { ...tile, rotation: (tile.rotation + 60) % 360 };
			}
			return tile;
		});
		onUpdateBoard({ ...boardState, tiles: updatedTiles });
	};

	return (
		<div
			ref={boardRef}
			className="relative w-full h-full bg-slate-800 overflow-hidden"
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
		>
			{boardState.tiles.map((placedTile) => {
				const tileDef = allTiles.find((t) => t.id === placedTile.tileId);
				if (!tileDef) return null;

				return (
					<div
						key={placedTile.id}
						className="absolute cursor-move select-none"
						style={{
							left: placedTile.x,
							top: placedTile.y,
							width: tileDef.size.width,
							height: tileDef.size.height,
							transform: `rotate(${placedTile.rotation}deg)`,
							backgroundImage: `url(${tileDef.path})`,
							backgroundSize: "contain",
							backgroundRepeat: "no-repeat",
							zIndex: 1,
						}}
						onMouseDown={(e) =>
							handleMouseDown(
								e,
								placedTile.id,
								"tile",
								placedTile.x,
								placedTile.y,
							)
						}
						onDoubleClick={(e) => handleTileDoubleClick(e, placedTile.id)}
					/>
				);
			})}

			{boardState.figures.map((fig) => (
				<div
					key={fig.id}
					className="absolute cursor-move select-none z-10 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-xs font-bold shadow-lg"
					style={{
						left: fig.x,
						top: fig.y,
					}}
					onMouseDown={(e) =>
						handleMouseDown(e, fig.id, "figure", fig.x, fig.y)
					}
				>
					{fig.name[0]?.toUpperCase()}
				</div>
			))}
		</div>
	);
}
