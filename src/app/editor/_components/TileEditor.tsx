"use client";

import React, { useState, useEffect } from "react";
import { saveTile } from "../../actions";
import type { Tile, Hex } from "../../../domain/tiles.model";

interface TileEditorProps {
	tile: Tile;
}

export function TileEditor({ tile }: TileEditorProps) {
	const [padding, setPadding] = useState(tile.padding);
	const [hexes, setHexes] = useState<Hex[]>(tile.hexes);
	const [doors, setDoors] = useState<Hex[]>(tile.doors || []);
	const [hexWidth, setHexWidth] = useState(tile.debugScale?.width || 64); // Default width or saved width
	const [editMode, setEditMode] = useState<"hexes" | "doors">("hexes");

	// For pointy-topped hexes:
	// Width = sqrt(3) * size
	// Height = 2 * size
	// Ratio Height/Width = 2 / sqrt(3) approx 1.1547
	const hexHeight = hexWidth * (2 / Math.sqrt(3));

	// Reset state when tile changes
	useEffect(() => {
		setPadding(tile.padding);
		setHexes(tile.hexes);
		setDoors(tile.doors || []);
		setHexWidth(tile.debugScale?.width || 64);
	}, [tile]);

	const handlePaddingChange = (axis: "x" | "y", value: number) => {
		setPadding((prev) => ({ ...prev, [axis]: value }));
	};

	const toggleHex = (x: number, y: number) => {
		if (editMode === "hexes") {
			setHexes((prev) => {
				const exists = prev.some((h) => h.x === x && h.y === y);
				if (exists) {
					// Also remove from doors if removing hex
					setDoors((d) => d.filter((h) => h.x !== x || h.y !== y));
					return prev.filter((h) => h.x !== x || h.y !== y);
				} else {
					return [...prev, { x, y }];
				}
			});
		} else {
			// Toggle door status, but only if it's a valid hex
			const isHex = hexes.some((h) => h.x === x && h.y === y);
			if (isHex) {
				setDoors((prev) => {
					const exists = prev.some((h) => h.x === x && h.y === y);
					if (exists) {
						return prev.filter((h) => h.x !== x || h.y !== y);
					} else {
						return [...prev, { x, y }];
					}
				});
			}
		}
	};

	const handleSave = async () => {
		const newTileData = {
			...tile,
			padding,
			hexes,
			doors,
			debugScale: { width: hexWidth },
		};

		const result = await saveTile(newTileData);
		if (result.success) {
			alert("Tile saved to file!");
		} else {
			alert("Failed to save tile.");
		}
	};

	// Helper to calculate pixel position of a hex
	const getHexPixel = (hx: number, hy: number) => {
		// Pointy-topped hexes layout (Odd-r offset usually?)
		// x spacing: width
		// y spacing: height * 0.75
		// odd rows shifted right by width/2

		// Let's assume Odd-R offset (shoves odd rows right)
		// x = width * (col + 0.5 * (row&1))
		// y = height * 0.75 * row

		return {
			x: padding.x + hexWidth * (hx + 0.5 * (hy % 2)),
			y: padding.y + hexHeight * 0.75 * hy,
		};
	};

	return (
		<div className="flex flex-col h-full gap-4">
			<div className="flex gap-4 items-center bg-slate-800 p-2 rounded flex-wrap">
				<div>
					<label className="block text-xs">Padding X</label>
					<input
						type="number"
						step="0.5"
						value={padding.x}
						onChange={(e) => handlePaddingChange("x", Number(e.target.value))}
						className="bg-slate-700 text-white px-2 py-1 rounded w-20"
					/>
				</div>
				<div>
					<label className="block text-xs">Padding Y</label>
					<input
						type="number"
						step="0.5"
						value={padding.y}
						onChange={(e) => handlePaddingChange("y", Number(e.target.value))}
						className="bg-slate-700 text-white px-2 py-1 rounded w-20"
					/>
				</div>
				<div>
					<label className="block text-xs">Hex Width</label>
					<input
						type="number"
						step="0.5"
						value={hexWidth}
						onChange={(e) => setHexWidth(Number(e.target.value))}
						className="bg-slate-700 text-white px-2 py-1 rounded w-20"
					/>
				</div>

				<div className="flex items-center gap-2 bg-slate-700 p-1 rounded">
					<button
						onClick={() => setEditMode("hexes")}
						className={`px-3 py-1 rounded text-xs ${editMode === "hexes" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-600"}`}
					>
						Edit Hexes
					</button>
					<button
						onClick={() => setEditMode("doors")}
						className={`px-3 py-1 rounded text-xs ${editMode === "doors" ? "bg-orange-600 text-white" : "text-slate-300 hover:bg-slate-600"}`}
					>
						Edit Doors
					</button>
				</div>

				<button
					onClick={handleSave}
					className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
				>
					Log JSON
				</button>
			</div>

			<div className="flex-1 overflow-auto relative bg-slate-950 border border-slate-700">
				<div
					className="relative"
					style={{ width: tile.size.width, height: tile.size.height }}
				>
					<img
						src={tile.path}
						alt={tile.id}
						className="absolute top-0 left-0 opacity-50 pointer-events-none"
					/>

					{/* Render a grid of potential hexes (e.g. 20x20) to allow clicking */}
					{Array.from({ length: 20 }).map((_, hx) =>
						Array.from({ length: 20 }).map((_, hy) => {
							const pos = getHexPixel(hx, hy);
							const isHex = hexes.some((h) => h.x === hx && h.y === hy);
							const isDoor = doors.some((h) => h.x === hx && h.y === hy);

							let fillColor = "transparent";
							let strokeColor = "rgba(255, 255, 255, 0.2)";

							if (isDoor) {
								fillColor = "rgba(234, 88, 12, 0.5)"; // Orange for doors
								strokeColor = "rgb(251, 146, 60)";
							} else if (isHex) {
								fillColor = "rgba(59, 130, 246, 0.5)"; // Blue for hexes
								strokeColor = "rgb(96, 165, 250)";
							}

							return (
								<div
									key={`${hx}-${hy}`}
									className="absolute cursor-pointer hover:opacity-80"
									style={{
										left: pos.x,
										top: pos.y,
										width: hexWidth,
										height: hexHeight,
									}}
									onClick={() => toggleHex(hx, hy)}
								>
									<svg
										viewBox="0 0 87 100"
										className="w-full h-full overflow-visible"
									>
										<polygon
											points="43.5,0 87,25 87,75 43.5,100 0,75 0,25"
											fill={fillColor}
											stroke={strokeColor}
											strokeWidth="2"
										/>
									</svg>
									<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] pointer-events-none text-white drop-shadow-md">
										{hx},{hy}
									</span>
								</div>
							);
						}),
					)}
				</div>
			</div>
		</div>
	);
}
