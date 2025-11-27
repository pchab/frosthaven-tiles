"use client";

import React, { useState, useRef } from "react";
import type { BoardState, PlacedTile, Figure } from "../../domain/board.model";
import allTiles from "../../domain/tiles";
import { allFigures } from "../../domain/figures";

interface BoardProps {
	boardState: BoardState;
	onUpdateBoard: (newState: BoardState) => void;
}

const DEFAULT_HEX_WIDTH = 133;
const SNAP_THRESHOLD = 50; // pixels

// Helper to calculate pixel position of a hex (matching TileEditor logic)
function getHexPixel(
	hx: number,
	hy: number,
	hexWidth: number,
	padding: { x: number; y: number },
): { x: number; y: number } {
	const hexHeight = hexWidth * (2 / Math.sqrt(3));
	return {
		x: padding.x + hexWidth * (hx + 0.5 * (hy % 2)),
		y: padding.y + hexHeight * 0.75 * hy,
	};
}

// Rotate a point around a center
function rotatePoint(
	point: { x: number; y: number },
	center: { x: number; y: number },
	angleDegrees: number,
): { x: number; y: number } {
	const rad = (angleDegrees * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	const dx = point.x - center.x;
	const dy = point.y - center.y;
	return {
		x: center.x + dx * cos - dy * sin,
		y: center.y + dx * sin + dy * cos,
	};
}

// Get all door positions for a placed tile in absolute pixel coordinates
function getDoorPositions(
	placedTile: PlacedTile,
	tileDef: {
		doors?: { x: number; y: number }[];
		size: { width: number; height: number };
		padding: { x: number; y: number };
		debugScale?: { width: number };
	},
): { x: number; y: number }[] {
	if (!tileDef.doors || tileDef.doors.length === 0) return [];

	const hexWidth = tileDef.debugScale?.width || DEFAULT_HEX_WIDTH;
	const tileCenter = {
		x: tileDef.size.width / 2,
		y: tileDef.size.height / 2,
	};

	return tileDef.doors.map((door) => {
		// Get hex position relative to tile
		const localPos = getHexPixel(door.x, door.y, hexWidth, tileDef.padding);

		// Apply rotation around tile center
		const rotatedPos = rotatePoint(localPos, tileCenter, placedTile.rotation);

		// Convert to absolute board coordinates
		return {
			x: placedTile.x + rotatedPos.x,
			y: placedTile.y + rotatedPos.y,
		};
	});
}


export function Board({ boardState, onUpdateBoard }: BoardProps) {
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const boardRef = useRef<HTMLDivElement>(null);

	// Pan and zoom state
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1.0);
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const [spacePressed, setSpacePressed] = useState(false);

	// Coordinate transformation helpers
	const screenToBoard = (screenX: number, screenY: number) => {
		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) return { x: screenX, y: screenY };

		const x = (screenX - rect.left - panOffset.x) / zoom;
		const y = (screenY - rect.top - panOffset.y) / zoom;
		return { x, y };
	};

	const boardToScreen = (boardX: number, boardY: number) => {
		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) return { x: boardX, y: boardY };

		const x = boardX * zoom + panOffset.x + rect.left;
		const y = boardY * zoom + panOffset.y + rect.top;
		return { x, y };
	};

	// Handle space key for panning
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" && !spacePressed) {
				setSpacePressed(true);
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				setSpacePressed(false);
				setIsPanning(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [spacePressed]);

	const handleMouseDown = (
		e: React.MouseEvent,
		id: string,
		type: "tile" | "figure",
		initialX: number,
		initialY: number,
	) => {
		// Check if we should pan instead of drag
		if (e.button === 1 || (e.button === 0 && spacePressed)) {
			// Let the board handle panning
			return;
		}

		e.stopPropagation();
		setDraggingId(id);
		const boardPos = screenToBoard(e.clientX, e.clientY);
		setDragOffset({ x: boardPos.x - initialX, y: boardPos.y - initialY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isPanning) {
			const dx = e.clientX - panStart.x;
			const dy = e.clientY - panStart.y;
			setPanOffset({
				x: panOffset.x + dx,
				y: panOffset.y + dy,
			});
			setPanStart({ x: e.clientX, y: e.clientY });
			return;
		}

		if (!draggingId || !boardRef.current) return;

		const boardPos = screenToBoard(e.clientX, e.clientY);
		const newX = boardPos.x - dragOffset.x;
		const newY = boardPos.y - dragOffset.y;

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
		setIsPanning(false);

		if (draggingId) {
			// Check if we're dragging a tile and apply door snapping
			const draggedTile = boardState.tiles.find((t) => t.id === draggingId);
			if (draggedTile) {
				const tileDef = allTiles.find((t) => t.id === draggedTile.tileId);
				if (tileDef) {
					const snappedPosition = findNearestDoorSnap(draggedTile, tileDef);
					if (snappedPosition) {
						const updatedTiles = boardState.tiles.map((tile) =>
							tile.id === draggingId
								? { ...tile, x: snappedPosition.x, y: snappedPosition.y }
								: tile,
						);
						onUpdateBoard({ ...boardState, tiles: updatedTiles });
						setDraggingId(null);
						return;
					}
				}
			}
		}
		setDraggingId(null);
	};

	// Find the nearest door to snap to
	const findNearestDoorSnap = (
		tile: PlacedTile,
		tileDef: {
			doors?: { x: number; y: number }[];
			size: { width: number; height: number };
			padding: { x: number; y: number };
			debugScale?: { width: number };
		},
	): { x: number; y: number } | null => {
		const tileDoors = getDoorPositions(tile, tileDef);
		if (tileDoors.length === 0) return null;

		let bestSnap: { x: number; y: number } | null = null;
		let bestDistance = SNAP_THRESHOLD;

		for (const existingTile of boardState.tiles) {
			if (existingTile.id === tile.id) continue;

			const existingDef = allTiles.find((t) => t.id === existingTile.tileId);
			if (!existingDef) continue;

			const existingDoors = getDoorPositions(existingTile, existingDef);

			for (const door1 of tileDoors) {
				for (const door2 of existingDoors) {
					const distance = Math.hypot(door1.x - door2.x, door1.y - door2.y);

					if (distance < bestDistance) {
						bestDistance = distance;
						// Calculate offset needed to align doors
						const offsetX = door2.x - door1.x;
						const offsetY = door2.y - door1.y;
						bestSnap = {
							x: tile.x + offsetX,
							y: tile.y + offsetY,
						};
					}
				}
			}
		}

		return bestSnap;
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const tileId = e.dataTransfer.getData("tileId");
		const figureId = e.dataTransfer.getData("figureId");

		const boardPos = screenToBoard(e.clientX, e.clientY);

		if (tileId) {
			const tileDef = allTiles.find((t) => t.id === tileId);
			if (tileDef) {
				const newTile: PlacedTile = {
					id: crypto.randomUUID(),
					tileId: tileDef.id,
					x: boardPos.x - tileDef.size.width / 2, // Center it
					y: boardPos.y - tileDef.size.height / 2,
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
					x: boardPos.x - 16, // Center 32x32
					y: boardPos.y - 16,
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

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();

		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) return;

		// Get mouse position relative to board
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Calculate zoom change (5% per step for smoother zooming)
		const zoomDelta = e.deltaY > 0 ? 0.95 : 1.05;
		const newZoom = Math.min(Math.max(zoom * zoomDelta, 0.1), 3.0);

		// Adjust pan to zoom towards cursor
		const scale = newZoom / zoom;
		const newPanX = mouseX - (mouseX - panOffset.x) * scale;
		const newPanY = mouseY - (mouseY - panOffset.y) * scale;

		setZoom(newZoom);
		setPanOffset({ x: newPanX, y: newPanY });
	};

	const handleBoardMouseDown = (e: React.MouseEvent) => {
		// Middle mouse button or space + left mouse button
		if (e.button === 1 || (e.button === 0 && spacePressed)) {
			e.preventDefault();
			setIsPanning(true);
			setPanStart({ x: e.clientX, y: e.clientY });
		}
	};

	return (
		<div
			ref={boardRef}
			className="relative w-full h-full bg-slate-800 overflow-hidden"
			style={{ cursor: isPanning || spacePressed ? "grab" : "default" }}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseDown={handleBoardMouseDown}
			onWheel={handleWheel}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
		>
			<div
				style={{
					transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
					transformOrigin: "0 0",
					width: "100%",
					height: "100%",
				}}
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
		</div>
	);
}
